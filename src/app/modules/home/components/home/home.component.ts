import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/post';
import { MainPost } from 'src/app/models/mainPost';
import { CommentsService } from 'src/app/core/http/comments.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  comments: Post[];
  mainPost: MainPost;

  // TODO: Implement hover event on thread to display parent thread info if it is not in viewport
  // https://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
  // TODO: Don't reset position when loading new content
  constructor(private commentsService : CommentsService) {
  }
  
  ngOnInit(): void {
    this.getMainPost('1');
    this.getReplies('1', environment.defaultSortType);
  }

  onSortChange($event) {
    this.getReplies('1', $event);
  }

  private getMainPost(id: string) {
    this.commentsService.getMainPost(id).subscribe(
      data => {
        this.mainPost = data;
      }, 
      error => {
        console.log(error);
      });
  }

  private getReplies(parentId: string, sortType: string) {
    this.commentsService.getReplies(parentId, sortType).subscribe(
      data => {
        this.comments = data;
      }, 
      error => {
        console.log(error);
      });
  };
  
  replySubmitted() {
    // Simulate server returning new Post record
    var newComment = new Post();
    newComment.parentId = this.mainPost.id;
    newComment.id = Math.random().toString();
    newComment.body = 'Test Comment';

    // push new comment to top of array
    // if type does not match setMockData it will not reload ngFor
    // refactor either all to create instances of Post or keep both using objects
    this.comments.unshift(
      { 
        parentId: this.mainPost.id, 
        id: Math.random().toString(),
        depth: 0,
        author: 'new_user',
        score: 1,
        body: 'New Direct Reply',
        createDate: '2019-01-03T23:12:11',
        numOfHiddenReplies: 0,
        mustContinueInNewThread: false,
        replies: []
      }
    );
  }
}