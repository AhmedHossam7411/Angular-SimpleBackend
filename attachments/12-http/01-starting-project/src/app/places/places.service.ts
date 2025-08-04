import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { map, catchError, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/*This design here ====> 
Keeps your service pure (no subscribe() here!)
Lets the component control the subscription
Automatically updates your signal, which the UI will react to*/

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
    const prevPlaces = this.userPlaces();
    
    if( !prevPlaces.some((p) => p.id === place.id)){  // improved optimistic updating
      
      this.userPlaces.set([...prevPlaces, place]); // updating UI immediately
    }
    
    return this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
    })
    .pipe(
      catchError((error) => {
        this.userPlaces.set(prevPlaces);
        return throwError(() => new Error('Failed to store selected place'))
      })
    );
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
