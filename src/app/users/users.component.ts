import { Component, OnInit } from '@angular/core';
import { WebDataService } from '../web-data.service';

import { trigger,style,transition,animate,keyframes,query,stagger } from '@angular/animations';
import { Chart } from 'angular-highcharts';
import * as Highcharts from 'highcharts/highcharts.js';
import * as xRange from 'highcharts/modules/xrange.js';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [  
    trigger('orders', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), {optional: true}),
        query(':enter', stagger('300ms', [
          animate('.4s ease-in', keyframes([
            style({opacity: 0, transform: 'translateX(-75%)', offset: 0}),
            style({opacity: .5, transform: 'translateX(35px)',  offset: 0.3}),
            style({opacity: 1, transform: 'translateX(0)',     offset: 1.0}),
          ]))]), {optional: true})
          ,
        query(':leave', stagger('300ms', [
          animate('.4s ease-out', keyframes([
            style({opacity: 1, transform: 'translateX(0)', offset: 0}),
            style({opacity: .5, transform: 'translateX(35px)',  offset: 0.3}),
            style({opacity: 0, transform: 'translateX(-75%)',     offset: 1.0}),
          ]))]), {optional: true})
      ])
    ])
  ]
})
export class UsersComponent implements OnInit {

  userId: number;
  user: any;
  ordersYGraph: any[];
  ordersNGraph: any[];
  data: any[];
  categories: any[];
  chart: any;
  
  constructor(private WDService: WebDataService) {
    
    this.ordersNGraph = [];
    this.ordersYGraph = [];
    this.user = null;
    this.data = [];
    this.categories = [];
    
  }

  ngOnInit() {
    xRange(Highcharts); 
    this.chart = Highcharts.chart('container', {
      chart: {
          type: 'xrange'
      },
      title: {
          text: 'Orders of user'
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: ''
          },
          categories: this.categories,
          reversed: true
      },
      series: [{
          name: 'Timelines',
          // pointPadding: 0,
          // groupPadding: 0,
          pointWidth: 20,
          data: this.data,
          dataLabels: {
              enabled: true
          }
      }]
      });
  }


  findUser() {
    this.WDService.getUser(this.userId).then((res) => {
      this.user = res;
      this.filterOrders();
      this.ordersNGraph = this.user.orders;
      console.log(this.ordersNGraph);
    });
  }

  addItemY(i:number){
    if (!this.ordersYGraph.find(o => o.name === this.ordersNGraph[i].name)){
      this.ordersYGraph.push(this.ordersNGraph[i]);
      this.changeChart();
    }      
  }

  removeItemY(i:number){
    this.ordersYGraph.splice(i, 1);
    this.changeChart();  
  }

  changeChart(){
    this.prepareDataChart();
    this.chart = Highcharts.chart('container', {
      chart: {
          type: 'xrange'
      },
      title: {
          text: 'Orders of user'
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: ''
          },
          categories: this.categories,
          reversed: true
      },
      series: [{
          name: 'Timelines',
          // pointPadding: 0,
          // groupPadding: 0,
          pointWidth: 20,
          data: this.data,
          dataLabels: {
              enabled: true
          }
      }]
      });
  }

  prepareDataChart(){
    this.data = [];
    this.categories = [];
    for (var j = 0; j < this.ordersYGraph.length; j++){
      for (var index = 0; index < this.ordersYGraph[j].timeE.length; index++) {
        this.data.push(
          {
            x: new Date(this.ordersYGraph[j].timeS[index]).getTime() + 60*60*1000*2,
            x2: new Date(this.ordersYGraph[j].timeE[index]).getTime() + 60*60*1000*2,
            y: j,
            partialFill: 1
          }
        );     
      }
      if(this.ordersYGraph[j].timeE.length < this.ordersYGraph[j].timeS.length){
        this.data.push(
          {
            x: new Date(this.ordersYGraph[j].timeS[index]).getTime() + 60*60*1000*2,
            x2: new Date().getTime() + 60*60*1000*2,
            y: j,
            partialFill: 1
          }
        ); 
      }
      this.categories.push(this.ordersYGraph[j].name);
    }
    
  }

  filterOrders(){
    if(this.user.orders.length > 0 && this.user.orders[0].hasOwnProperty('displayed')){
      this.user.orders = this.user.orders.filter(order => order.displayed == 1);
    }
  }

}
