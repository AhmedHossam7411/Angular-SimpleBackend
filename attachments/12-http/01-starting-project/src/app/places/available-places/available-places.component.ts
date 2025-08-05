import { Component, DestroyRef, inject, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';
// import { OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent {

  //places = signal<Place[] | undefined>(undefined);
  isFetching = signal(false); // Signal to track fetching state
  error = signal(''); // Signal to track any error that occurs
  // private httpClient= inject(HttpClient);  // Injecting HttpClient for making HTTP requests
  private destroyRef = inject(DestroyRef); // Injecting DestroyRef to manage component lifecycle
  private placesService = inject(PlacesService); // Injecting PlacesService to access places data
  places = this.placesService.loadedAllPlaces; // Accessing the loaded user places from the service
  
  
  ngOnInit() // Lifecycle hook to fetch places when the component initializes
  {
    console.log("any1");
    this.isFetching.set(true); // Setting fetching state to true before making the request
    const subscription = this.placesService.loadAvailablePlaces()
    .subscribe({  // Subscribing to the observable to get the places data
     
      error: (error:Error) => {
        console.log(error); console.log("any1"); 
        this.error.set("something went wrong while fetching places");
         // Setting error message if an error occurs
      
        },  // Handling any error that occurs during the request
      complete: () => {  // Handling completion of the observable
        this.isFetching.set(false); // Setting fetching state to false after the request completes because the data is fetched
      }, 
    });
      
    this.destroyRef.onDestroy(() => {  // Cleanup logic when the component is destroyed
        subscription.unsubscribe();
    });
    console.log("any1");
  }

  onSelectPlace(selectedPlace: Place)
  {
    console.log('selevted place',selectedPlace); console.log("any1");
       const subscription=this.placesService.addPlaceToUserPlaces(selectedPlace)
      .subscribe({
        next: (resData: any) => console.log(resData), })

        this.destroyRef.onDestroy(() => {  // Cleanup logic when the component is destroyed
        subscription.unsubscribe();
    });
  }


}
