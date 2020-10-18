import { ajax } from 'rxjs/ajax';
import {
  pluck, map, switchMap, catchError,
} from 'rxjs/operators';
import {
  zip, interval, of,
} from 'rxjs';
import moment from 'moment';

moment.locale('ru');

export default class PostWidget {
  constructor(url) {
    this.container = document.querySelector('.container');
    this.loadingImg = document.querySelector('.loading-container');
    this.url = url;
  }

  static renderComments(comments) {
    let HTML = '<h2>Latest comments</h2>';
    comments.forEach((comment) => {
      HTML += `<div class="comment">
          <div class="comment-avatar"><img class="comment-avatar-image" src="${comment.avatar}"></div>
          <div class="comment-body">
            <div class="comment-header">
            <span class="comment-author">${comment.author}</span><span class="comment-date">${moment(comment.created).format('hh:mm:ss MM.DD.YY')}</span>
            </div>
            <div class="comment-content">${comment.content}</div>
          </div>
        </div>
      `;
    });
    HTML += '<button type="button" class="load-button">Load More</button>';
    return HTML;
  }

  static renderPost(post) {
    const HTML = `<div class="post_header">
    <div class="avatar">
      <img class="avatar-image" src="${post.avatar}">
    </div>
    <div class="post-info">
      <div class="author">${post.author}</div>
      <div class="date">${moment(post.created).format('hh:mm:ss MM.DD.YY')}</div>
    </div>
  </div>
  <div class="post_content">
    <img class="content-image" src="${post.image}">
  </div>`;
    return HTML;
  }

  getPostsWithComments() {
    interval(10000).pipe(
      switchMap(() => ajax.getJSON(`${this.url}posts/latest`)
        .pipe(
          pluck('data'),
          catchError(() => of([])),
          map((data) => JSON.parse(data)),
          switchMap((posts) => zip(...posts.map(
            (post) => ajax.getJSON(`${this.url}posts/${post.id}/comments/latest`)
              .pipe(
                pluck('data'),
                catchError(() => of([])),
                map((data) => JSON.parse(data)),
                map((comments) => ({ ...post, comments })),
              ),
          ))),
        )),
    ).subscribe((posts) => {
      this.loadingImg.classList.add('hidden');
      this.container.innerHTML = '';
      posts.forEach((post) => this.drawPost(post));
    });
  }

  drawPost(data) {
    const postContainer = document.createElement('div');
    postContainer.className = 'post-container';
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = PostWidget.renderPost(data);
    const comments = document.createElement('div');
    comments.className = 'comments';
    comments.innerHTML = PostWidget.renderComments(data.comments);

    postContainer.appendChild(post);
    postContainer.appendChild(comments);
    this.container.appendChild(postContainer);
  }
}
