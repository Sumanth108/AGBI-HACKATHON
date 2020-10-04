import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataFilteringService {
  public postsList: any = [];
  constructor() { }
  setPostList(posts: any) {
    this.postsList = posts;
  }
  filterPosts(searchTerm: string) {
    return this.postsList.filter(item => {
      return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
    });
  }
}
