import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { WaypointAdderPage } from '../../waypoint/waypoint-adder/waypoint-adder.component'

@Component({
  templateUrl: 'slides.component.html'
})
export class Slides {
  slides = [
    {
      title: "Welkom bij de ANWB fietsroute applicatie!",
      description: "Deze app ondersteunt u bij het fietsen van een knooppuntenroute. <br/> Voor deze app dient u uw route te plannen op: ANWB.nl of d.m.v. het ANWB fietsrouteboek.",
      image: "./assets/images/img1.png",
    },
    {
      title: "Hoe werkt de ANWB fietsroute app?",
      description: 'Straks kunt u uw knooppunten toevoegen en beginnen met het fietsen. Als u begint met uw geselecteerde route krijgt u van de app verschillende informatie: Volgende knooppunt, Het daaropvolgend knooppunt, Uw afgelegde afstand, De afstand tot het eerstvolgende knooppunt en nog veel meer.',
      image: "./assets/images/img2.png",
    },
    {
      title: "Uw routes worden opgeslagen.",
      description: "Uw routes zijn bij ons veilig. Uw routes tezamen eerdergenoemde informatie wordt opgeslagen, zodat u kunt zien waar en wanneer u heeft gefietst. Wij begrijpen dat deze informatie privacygevoelig is, daarom dient u eerst in te loggen met uw vingerafdrukscanner",
      image: "./assets/images/img3.png",
    },
    {
      title: "Vind u het geluid vervelend?",
      description: "Wij begrijpen dat iedereen andere wensen heeft. Om ieders wensen te vervullen kunt u zelf bepalen of u geluid, trilling of beide wilt als u een knooppunt nadert.",
      image: "./assets/images/img4.png",
    }
  ];

  constructor(public navCtrl: NavController) {
  }

  continueOrSkipClicked() {
      this.navCtrl.push(WaypointAdderPage);
  }
}