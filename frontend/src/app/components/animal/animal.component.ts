import { Component, OnInit, Inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

interface IAnimalDataItem {
  animalname: string;
  animaltype: string;
  animalrace: string;
  animalheight: number;
  animalweight: number;
}

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})

export class AnimalComponent implements OnInit {
  public animaldataItems: IAnimalDataItem[] = [];
  name: string;
  type: string;
  race: string;
  height: number;
  weight: number;

  displayedColumns: string[] = ['name', 'type', 'race', 'height', 'weight'];

  constructor(@Inject(DOCUMENT) document,
              private httpClient: HttpClient
  ) {
  }

  async ngOnInit() {
    await this.loadAnimalData();
  }

  async loadAnimalData() {
    this.animaldataItems = await this.httpClient.get<IAnimalDataItem[]>('/api/animal').toPromise();
  }

  async addAnimalData(){
    await this.httpClient.post('/api/animal', {
      animalname: this.name,
      animaltype: this.type,
      animalrace: this.race,
      animalheight: this.height,
      animalweight: this.weight,
    }).toPromise();

    this.name = '';
    this.type = '';
    this.race = '';
    this.height = null;
    this.weight = null;

    await this.loadAnimalData();
  }
}
