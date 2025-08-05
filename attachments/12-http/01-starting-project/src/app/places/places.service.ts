import { inject, Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { map, catchError, throwError, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../shared/error.service';

/*This design here ====> 
Keeps your service pure (no subscribe() here!)
Lets the component control the subscription
Automatically updates your signal, which the UI will react to*/

@Injectable({
  providedIn: 'root',
})
export class PlacesService {

  httpClient = inject(HttpClient); // Injecting HttpClient for making HTTP requests
  errorService = inject(ErrorService);
   allPlaces = signal<Place[]>([]);
   userFavoritePlaces = signal<Place[]>([]);
   loadedAllPlaces = this.allPlaces.asReadonly();
    loadedUserFavoritePlaces = this.userFavoritePlaces.asReadonly();

  loadAvailablePlaces() 
  {

    return this.fetchPlaces('http://localhost:3000/places', 
      'something went wrong while fetching places')
       .pipe(tap({
        next : (allPlaces) => this.allPlaces.set(allPlaces) // Updating the user places signal with the fetched data
       }))
  }

  loadUserPlaces() 
  {
    return this.fetchPlaces('http://localhost:3000/user-places', 
      'something went wrong while fetching favorite places')
      .pipe(tap({
      next: (favorites) => this.userFavoritePlaces.set(favorites)
    }));
  }

  addPlaceToUserPlaces(place: Place) 
  {
    const prevPlaces = this.userFavoritePlaces();
    
    if( !prevPlaces.some((p) => p.id === place.id)){  // improved optimistic updating
      this.userFavoritePlaces.set([...prevPlaces, place]); // updating UI immediately
    }
    console.log('sending request');
    return this.httpClient.put('http://localhost:3000/user-places', {
        placeId: place.id,
    })
    .pipe(
      catchError((error) => {
        console.log('sss',error);
        this.userFavoritePlaces.set(prevPlaces);
        this.errorService.showError('Failed to store selected place') // Error Service show Error
        return throwError(() => new Error('Failed to store selected place'))  
      })
    );
  }

  removeUserPlace(place: Place) 
  {
    const prevPlaces = this.userFavoritePlaces();
    
     if (prevPlaces.some((p) => p.id === place.id)) {
     const updatedPlaces = prevPlaces.filter((p) => p.id !== place.id); 
     this.userFavoritePlaces.set(updatedPlaces); // update signal
     }

    console.log('sending request');
    return this.httpClient.put(`http://localhost:3000/user-places/${place.id}` ,{
        placeId: place.id,
    })
    .pipe(
      catchError((error) => {
        console.log(error);
        this.userFavoritePlaces.set(prevPlaces);
        this.errorService.showError('Failed to delete selected place') // Error Service show Error
        return throwError(() => new Error('Failed to delete selected place'))  
      })
    );
  }

  private fetchPlaces(url:string , errorMessage: string) {

     return this.httpClient.get<{places:Place[]}>(url)
         .pipe(  
           map((resData) => resData.places),catchError  
           ((error) => 
             throwError(()=> new Error(errorMessage))) 

           )
  }
}
