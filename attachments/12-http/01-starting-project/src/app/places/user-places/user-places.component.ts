import { Component, DestroyRef, inject, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { map, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent {
  places = signal<Place[] | undefined>(undefined);
    isFetching = signal(false); // Signal to track fetching state
    error = signal(''); // Signal to track any error that occurs
    private httpClient= inject(HttpClient);  // Injecting HttpClient for making HTTP requests
    private destroyRef = inject(DestroyRef); // Injecting DestroyRef to manage component lifecycle
  
    ngOnInit() // Lifecycle hook to fetch places when the component initializes
    {
      this.isFetching.set(true); // Setting fetching state to true before making the request
      const subscription = this.httpClient.get<{places:Place[]}>('http://localhost:3000/user-places')
      .pipe(  // Using RxJS pipe to transform the observable 
        map((resData) => resData.places),catchError  
        ((error) => 
          throwError(()=> new Error(''))) // Handling errors and transforming the response
        // Mapping the response to extract the places array
        )
        .subscribe({  // Subscribing to the observable to get the places data
        next: (places) => {  // Handling the next value emitted by the observable
          
          this.places.set(places)  // Logging the places received from the server
        },
  
        error: (error) => {
          console.log(error); 
          this.error.set("something went wrong while fetching favorite places");
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
  
}
