import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  errorMessage: string;
  private userTyping: boolean;
  private accumulator: number;
  private currentOperand: string;
  private displayValue: string;
  private get currentValue() {
    return parseFloat(this.displayValue);
  };

  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.removeAllCalc();
  }

  touchDigit(eventHandler) {
    let digitAsString = eventHandler.srcElement.innerText;
    if(this.userTyping) {
      this.displayValue = this.displayValue + digitAsString;
    } else {
      this.displayValue = digitAsString;
      this.userTyping = true;
    }
  }

  touchBinaryOperation(eventHandler) {
    this.currentOperand = eventHandler.srcElement.innerText;
    this.accumulator = this.currentValue;
    this.userTyping = false;
  }

  touchUnaryOperation(eventHandler) {
    let unaryOperator = eventHandler.srcElement.innerText;
    switch(unaryOperator) {
      case "COS": 
        this.displayValue = (Math.cos(this.currentValue)).toString();
        break;
      case "±":
        this.displayValue = (-this.currentValue).toString();
        break;
      case "√":
        this.displayValue = (Math.sqrt(this.currentValue)).toString();
    }
    this.userTyping = false;
  }

  touchEquals() {
    switch (this.currentOperand) {
      case "−": 
        this.displayValue = (this.accumulator - this.currentValue).toString();
        break;
      case "+": 
        this.displayValue = (this.accumulator + this.currentValue).toString();
        break;
      case "÷": 
        this.displayValue = (this.accumulator / this.currentValue).toString();
        break;
      case "×": 
        this.displayValue = (this.accumulator * this.currentValue).toString();
        break;
      default: 
        this.errorMessage = `You shouldn't come here. Operator used: ${this.currentOperand}.`;
        break;
    }
    this.userTyping = false;
  }

  removeAllCalc() {
    this.displayValue = "0";
    this.userTyping = false;
  }
}
