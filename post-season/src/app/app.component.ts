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

  // Angular Table sorting pagination
  displayedColumns: string[] = ['away', 'home', 'date', 'series'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource:any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    //Fetch the data from endpoint
    this.getJSON().subscribe(data => {
        this.hasDataLoaded = true;
        // Loop through series and games to get each individual game.
        for(let serie of data.series) {
          for(let game of serie.games) {
            // For Angular sorting, the interface variable names need
            // to be identical to the `game` variable
            game.away = game.teams.away.team.teamName;
            game.home = "@ " + game.teams.home.team.teamName;
            game.date = game.gameDate;
            game.series = game.seriesStatus.shortName;
            // add each game into the list of games.
            this.listOfGames.push(game)
          }
        }

        //Angular Table inits
        this.dataSource = new MatTableDataSource<GameElement>(this.listOfGames);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  //Get data http call
  getJSON(): Observable<any> {
      return this.http.get("http://statsapi.mlb.com/api/v1/schedule/postseason/series?sportId=1&season=2018&hydrate=team,broadcasts%28all%29,seriesStatus%28useOverride=true%29,decisions,person,probablePitcher,linescore%28matchup%29");
  }

  //Angular Table Search functionality
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
//Data Table header elements
export interface GameElement {
  away: string;
  home: string;
  date: string;
  series: string;
}
