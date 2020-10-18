import PostWidget from './LatestPostsWidget';

const URL = 'https://ahj-rxjs-2-backend.herokuapp.com/';
const latestPostsWidget = new PostWidget(URL);
latestPostsWidget.getPostsWithComments();
