import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
    //places = signal<Place[] | undefined>(undefined);
    private placesService = inject(PlacesService); // Injecting PlacesService to access places data
    places = this.placesService.loadedUserFavoritePlaces;
    isFetching = signal(false); // Signal to track fetching state
    error = signal(''); // Signal to track any error that occurs
    // private httpClient= inject(HttpClient);  // Injecting HttpClient for making HTTP requests
    private destroyRef = inject(DestroyRef); // Injecting DestroyRef to manage component lifecycle
    
    ngOnInit() // Lifecycle hook to fetch places when the component initializes
    {
      this.isFetching.set(true); // Setting fetching state to true before making the request
      const subscription = this.placesService.loadUserPlaces().subscribe({  // Subscribing to the observable to get the places data
        next: (places) => {
        //console.log(places)
          //this.places.set(places)  // Logging the places received from the server
        },
        error: (error: Error) => {
           
          this.error.set(error.message);
           // Setting error message if an error occurs
        
          },  // Handling any error that occurs during the request
        complete: () => {  // Handling completion of the observable
          this.isFetching.set(false); // Setting fetching state to false after the request completes because the data is fetched
        }, 
      });
        
      this.destroyRef.onDestroy(() => {  // Cleanup logic when the component is destroyed
          subscription.unsubscribe();
      });
    }

    onRemovePlace(place : Place)
    {
      const subscription = this.placesService.removeUserPlace(place).subscribe();

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
    }
  
}
