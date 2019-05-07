import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  listOfGames:any=[];
  hasDataLoaded:boolean=false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getJSON().subscribe(data => {
        this.hasDataLoaded = true;
        for(let serie of data.series) {
          for(let game of serie.games) {
            this.listOfGames.push(game)
          }
        }
    });
    console.log(this.listOfGames)
  }

  getJSON(): Observable<any> {
      return this.http.get("http://statsapi.mlb.com/api/v1/schedule/postseason/series?sportId=1&season=2018&hydrate=team,broadcasts%28all%29,seriesStatus%28useOverride=true%29,decisions,person,probablePitcher,linescore%28matchup%29");
  }

}
