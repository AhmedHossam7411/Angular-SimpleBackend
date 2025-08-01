import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {
  places = signal<Place[] | undefined>(undefined);

  private httpClient= inject(HttpClient);  // Injecting HttpClient for making HTTP requests
  private destroyRef = inject(DestroyRef); // Injecting DestroyRef to manage component lifecycle
  ngOnInit() // Lifecycle hook to fetch places when the component initializes
  {
    const subscription = this.httpClient.get<{places:Place[]}>('http://localhost:3000/places',
    {
      observe: 'response',  // Observing the full HTTP response

    }).subscribe({
      next: (response) => {
        console.log(response)
        console.log(response.body?.places);  // Logging the places received from the server
      }
    });
      
    this.destroyRef.onDestroy(() => {  // Cleanup logic when the component is destroyed
        subscription.unsubscribe();
    });
  }

}
