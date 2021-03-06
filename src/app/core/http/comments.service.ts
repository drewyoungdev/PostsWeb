import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from 'src/app/models/post';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainPost } from 'src/app/models/mainPost';
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private postsApiBaseUrl = environment.postsApiBaseUrl;
  private maxDepth = environment.maxDepth;

  private configUrl = './assets/mocks';
  private isServerRunning: boolean = false;

  private mainPosts: MainPost[]; // local cache

  // Set MainPost that was clicked in local cache
  // Update URL with Angular Location (https://stackoverflow.com/questions/35618463/change-route-params-without-reloading-in-angular-2)
  // Modal will generate based on the MainPost in cache
  // Destroy everything on close

  constructor(private httpClient: HttpClient) { }

  getMainFeed(sortType: string): Observable<MainPost[]> {
    return (this.isServerRunning ? 
    this.httpClient.get<MainPost[]>(`${this.postsApiBaseUrl}/all/${sortType}`) :
    this.httpClient.get<MainPost[]>(`${this.configUrl}/mainFeed.json`).pipe(delay(2000)));
  }

  getMainPost(id: string): Observable<MainPost> {
    return (this.isServerRunning ? 
    this.httpClient.get<MainPost>(`${this.postsApiBaseUrl}/${id}`) :
    this.httpClient.get<MainPost>(`${this.configUrl}/mainPost.json`));
  }

  getReplies(parentId: string, sortType: string): Observable<Post[]> {
    return (this.isServerRunning ?
    this.httpClient.get<Post[]>(`${this.postsApiBaseUrl}/${parentId}/replies/${sortType}?maxDepth=${this.maxDepth}`) :
    this.httpClient.get<Post[]>(`${this.configUrl}/comments.json`).pipe(delay(2000)));
  }
}
