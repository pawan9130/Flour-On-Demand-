import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Review { id: number; shopId: number; shopName: string; rating: number; text: string; date: string }

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private reviews: Review[] = [];

  submitFeedback(orderId: number, feedback: Partial<Review>): Observable<{ success: boolean; review?: Review }> {
    const r: Review = { id: Math.floor(Math.random()*100000), shopId: feedback.shopId || 0, shopName: feedback.shopName || '', rating: feedback.rating || 5, text: feedback.text || '', date: new Date().toISOString() };
    this.reviews.unshift(r);
    return of({ success: true, review: r });
  }

  getUserReviews(): Observable<Review[]> { return of(this.reviews); }

  updateReview(id: number, data: Partial<Review>): Observable<Review | undefined> { const idx = this.reviews.findIndex(r=>r.id===id); if(idx===-1) return of(undefined); this.reviews[idx] = { ...this.reviews[idx], ...data }; return of(this.reviews[idx]); }

  deleteReview(id: number): Observable<boolean> { this.reviews = this.reviews.filter(r=>r.id!==id); return of(true); }
}
