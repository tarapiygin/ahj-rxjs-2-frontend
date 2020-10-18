import PostWidget from './LatestPostsWidget';

const URL = 'http://localhost:7070/';
const latestPostsWidget = new PostWidget(URL);
latestPostsWidget.getPostsWithComments();
