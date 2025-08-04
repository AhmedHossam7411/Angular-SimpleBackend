import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { map, catchError, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  httpClient = inject(HttpClient); // Injecting HttpClient for making HTTP requests
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();  // Accessing the loaded user places as a readonly signal

  loadAvailablePlaces() 
  {
    return this.fetchPlaces('http://localhost:3000/places', 
      'something went wrong while fetching places')
       .pipe(tap({
        next : (userPlaces) => this.userPlaces.set(userPlaces) // Updating the user places signal with the fetched data
       }))
  }

  loadUserPlaces() 
  {
    return this.fetchPlaces('http://localhost:3000/user-places', 
      'something went wrong while fetching favorite places')
  }

  addPlaceToUserPlaces(place: Place) 
  {
    return this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
    });
  }

  removeUserPlace(place: Place) {}

  private fetchPlaces(url:string , errorMessage: string) {

     return this.httpClient.get<{places:Place[]}>(url)
         .pipe(  
           map((resData) => resData.places),catchError  
           ((error) => 
             throwError(()=> new Error(errorMessage))) 

           )
  }
}
