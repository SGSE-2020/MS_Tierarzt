import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

interface IAnimalDataItem {
  animalname: string;
  animaltype: string;
}

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css']
})
export class AnimalComponent implements OnInit {

  public animalname = '';
  public animaltype = '';
  public animaldataItems: IAnimalDataItem[] = [];

  constructor(
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
      animalname: this.animalname,
      animaltype: this.animaltype
    }).toPromise();

    await this.loadAnimalData();
    this.animalname = '';
    this.animaltype = '';
  }

}
