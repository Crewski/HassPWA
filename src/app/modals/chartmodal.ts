import { Component, Inject, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Chart from 'chart.js';
import * as Hammer from 'hammerjs';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environments/environment';


interface ChartModalData {
    entity_id: string;
    friendly_name: string;
}

@Component({
    selector: 'chart-modal',
    template: `    
        <div id="dialog-cont" style="width: 100%; height: 100%;">    
        
            <canvas id="canvas" ></canvas>    
        </div>
    `,
})
export class ChartModal implements OnInit {

    chart: Chart;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: ChartModalData,
        private dialogRef: MatDialogRef<ChartModal>,
        private http: HttpService
    ) { }

    ngOnInit() {

        let hammertime = new Hammer(document.getElementById('dialog-cont'));
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        hammertime.on('swipe', ev => {
          if(ev.deltaY > 0) this.dialogRef.close();
        }); 
        if (environment.production) {

            this.http.getHistory(this.data.entity_id).subscribe(res => {
                this.doGraph(res);
            })
        } else {
            this.doGraph(this.getMockData());
        }
    }

    doGraph(data: any) {
        let graphData = [];
        data[0].forEach(point => {
            graphData.push({ x: new Date(point.last_updated), y: +point.state })
        });

        this.chart = new Chart('canvas', {

            type: 'line',
            data: {
                datasets: [{
                    data: graphData,
                    backgroundColor: [
                        'rgba(83, 109, 254, 0.2)'
                    ],
                    borderColor: [
                        'rgba(83, 109, 254, 1)'
                    ],
                    borderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: this.data.friendly_name
                },
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'hour'
                        }
                    }]
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                tooltips: {
                    // mode: 'nearest',
                    axis: 'x',
                    intersect: false,

                    custom: function (tooltip) {
                        if (!tooltip) return;
                        // disable displaying the color box;
                        tooltip.displayColors = false;
                    },
                },
            }
        });
    }

    getMockData(): any {
        let mockData = `
        [
            [
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f468ba1ef7a44dc3b937774625aeb5a4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T12:48:59.086140+00:00",
                    "last_updated": "2020-04-05T12:48:59.086140+00:00",
                    "state": "66.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e78d18d8c2d14b64b9b3d572e66a8ed9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:21:29.021995+00:00",
                    "last_updated": "2020-04-05T17:21:29.021995+00:00",
                    "state": "75.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f7eaf54018144406bf23e59041151ddf",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:24:35.030151+00:00",
                    "last_updated": "2020-04-05T17:24:35.030151+00:00",
                    "state": "75.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0dd3a6624d724db38af8b7245c204422",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:27:41.032211+00:00",
                    "last_updated": "2020-04-05T17:27:41.032211+00:00",
                    "state": "76.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "dcc5eb933da2424787613e13bb33465e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:30:47.028541+00:00",
                    "last_updated": "2020-04-05T17:30:47.028541+00:00",
                    "state": "77.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7a7b79310a7b48419ab2d28446fba162",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:33:53.011319+00:00",
                    "last_updated": "2020-04-05T17:33:53.011319+00:00",
                    "state": "77.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "1b783ed47a3f41a3873bcaab98afe0b7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:36:59.014224+00:00",
                    "last_updated": "2020-04-05T17:36:59.014224+00:00",
                    "state": "78.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "8664510534554a11953c2d37cfd25a92",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:40:05.007937+00:00",
                    "last_updated": "2020-04-05T17:40:05.007937+00:00",
                    "state": "78.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b53ad69e6d984835a71d084c34aa8b83",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:43:11.010112+00:00",
                    "last_updated": "2020-04-05T17:43:11.010112+00:00",
                    "state": "78.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2cf0a85f1e914179979e50825ba021e0",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:45:46.503538+00:00",
                    "last_updated": "2020-04-05T17:45:46.503538+00:00",
                    "state": "77.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "5f62a2ab596348d188614fb794bd0f18",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:51:58.011431+00:00",
                    "last_updated": "2020-04-05T17:51:58.011431+00:00",
                    "state": "77.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "090720bbc5f24a76822ee3679a0525cb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:55:04.018405+00:00",
                    "last_updated": "2020-04-05T17:55:04.018405+00:00",
                    "state": "77.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e90659064929445f88796f86d398970b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T17:58:09.012107+00:00",
                    "last_updated": "2020-04-05T17:58:09.012107+00:00",
                    "state": "77.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e927e30018014470904612b1efb20a28",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:01:15.032106+00:00",
                    "last_updated": "2020-04-05T18:01:15.032106+00:00",
                    "state": "77.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "1ffc4df7252843918b2ffff3e4cde52e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:04:20.047534+00:00",
                    "last_updated": "2020-04-05T18:04:20.047534+00:00",
                    "state": "77.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d2160ca08a1a4f9692c39d44964871ec",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:07:25.011312+00:00",
                    "last_updated": "2020-04-05T18:07:25.011312+00:00",
                    "state": "76.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a63f18f392a240038142ba2a9ff134aa",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:13:35.015756+00:00",
                    "last_updated": "2020-04-05T18:13:35.015756+00:00",
                    "state": "76.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ee0fc72f6dfe44f5bd8ea54ab586a182",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:16:40.024073+00:00",
                    "last_updated": "2020-04-05T18:16:40.024073+00:00",
                    "state": "76.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0448505f8b914d4a88e6589288f302a7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:19:45.028373+00:00",
                    "last_updated": "2020-04-05T18:19:45.028373+00:00",
                    "state": "76.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "54c10f8c33554ef6b1b614e0a02d7e8b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:22:51.022386+00:00",
                    "last_updated": "2020-04-05T18:22:51.022386+00:00",
                    "state": "76.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "607ddd63ef2b40648cb55573da5520c7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:25:25.013881+00:00",
                    "last_updated": "2020-04-05T18:25:25.013881+00:00",
                    "state": "76.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d406958804044aa79c234a37b4ca7e16",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:28:30.014508+00:00",
                    "last_updated": "2020-04-05T18:28:30.014508+00:00",
                    "state": "75.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0f771912f12e4948afae2ba2033773ad",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:40:53.013599+00:00",
                    "last_updated": "2020-04-05T18:40:53.013599+00:00",
                    "state": "75.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ab518dc4f4534553817c7078447dbb61",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:43:58.012950+00:00",
                    "last_updated": "2020-04-05T18:43:58.012950+00:00",
                    "state": "75.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3106492c6dc54357b27a18a3a615bbe9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:47:04.013756+00:00",
                    "last_updated": "2020-04-05T18:47:04.013756+00:00",
                    "state": "74.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "827da35908294311a78f4539caf7ac5d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:50:10.011568+00:00",
                    "last_updated": "2020-04-05T18:50:10.011568+00:00",
                    "state": "74.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "785b5cae2e844e28b4eaa0133549a884",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:53:16.021232+00:00",
                    "last_updated": "2020-04-05T18:53:16.021232+00:00",
                    "state": "73.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f0595307e5744c2d8592604376525cc5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:55:51.013783+00:00",
                    "last_updated": "2020-04-05T18:55:51.013783+00:00",
                    "state": "73.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "cbec1754fd5a40bd90eac154abe08f9b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T18:58:57.022943+00:00",
                    "last_updated": "2020-04-05T18:58:57.022943+00:00",
                    "state": "73.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3c8739907a884f3db42b72c33f4e8c7d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:02:03.011474+00:00",
                    "last_updated": "2020-04-05T19:02:03.011474+00:00",
                    "state": "73.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "507f996c656c45c79e65ffdd58feeacb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:05:09.013637+00:00",
                    "last_updated": "2020-04-05T19:05:09.013637+00:00",
                    "state": "72.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ca677f4044cd492eb1bb1e9a86785f62",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:08:15.019068+00:00",
                    "last_updated": "2020-04-05T19:08:15.019068+00:00",
                    "state": "72.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d9ab4f2a4e2c413385548ba1f739bdce",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:14:27.027560+00:00",
                    "last_updated": "2020-04-05T19:14:27.027560+00:00",
                    "state": "71.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "17821a4c6f6b413fa9aa8034461c66c3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:20:37.021063+00:00",
                    "last_updated": "2020-04-05T19:20:37.021063+00:00",
                    "state": "71.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9719367fb02148cab09bb6bcd4a46ad3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:23:43.018480+00:00",
                    "last_updated": "2020-04-05T19:23:43.018480+00:00",
                    "state": "71.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e3a4c73cfe0c46b9af2f4f3007892a78",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:29:24.026767+00:00",
                    "last_updated": "2020-04-05T19:29:24.026767+00:00",
                    "state": "71.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ae4b473ff1b14292a5bbd61fcf4c01a1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:32:30.015369+00:00",
                    "last_updated": "2020-04-05T19:32:30.015369+00:00",
                    "state": "71.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "19ac8b64ebb34d72a6968e1aa5fea1b2",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:35:35.012450+00:00",
                    "last_updated": "2020-04-05T19:35:35.012450+00:00",
                    "state": "71.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2a09902b3ad2451cb647e7511af86d9e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:38:39.024692+00:00",
                    "last_updated": "2020-04-05T19:38:39.024692+00:00",
                    "state": "72.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "8b84c76d4b0342fca10d19b4f78db800",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:41:44.011505+00:00",
                    "last_updated": "2020-04-05T19:41:44.011505+00:00",
                    "state": "72.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d2dd49b353714afba3f9cf100663fb03",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:44:50.014668+00:00",
                    "last_updated": "2020-04-05T19:44:50.014668+00:00",
                    "state": "72.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3e5ebce8558c47d99517a5df9ac14186",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:51:02.011833+00:00",
                    "last_updated": "2020-04-05T19:51:02.011833+00:00",
                    "state": "72.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "52ffdc4800d644e6ae5b890c7de71e83",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:54:08.014486+00:00",
                    "last_updated": "2020-04-05T19:54:08.014486+00:00",
                    "state": "72.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7bf7f9ba89374331bf8567648062562a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T19:59:49.011693+00:00",
                    "last_updated": "2020-04-05T19:59:49.011693+00:00",
                    "state": "72.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "58424d6e255f494b89b924d6ec3a8aee",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:02:54.014737+00:00",
                    "last_updated": "2020-04-05T20:02:54.014737+00:00",
                    "state": "72.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9039095d3d3a4088b9ac0639a732a4e9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:06:00.017171+00:00",
                    "last_updated": "2020-04-05T20:06:00.017171+00:00",
                    "state": "73.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e231294edfff4f9c9ef973dce9913d64",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:15:17.012719+00:00",
                    "last_updated": "2020-04-05T20:15:17.012719+00:00",
                    "state": "73.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "de0b51b3430a4363a68b50504c5423e7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:18:23.022964+00:00",
                    "last_updated": "2020-04-05T20:18:23.022964+00:00",
                    "state": "73.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "621f7d496d0d4de59e37808bb88f0851",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:21:29.013318+00:00",
                    "last_updated": "2020-04-05T20:21:29.013318+00:00",
                    "state": "73.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "15fd88f6409d4be08e4f5f2cd8e596b1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:24:35.019087+00:00",
                    "last_updated": "2020-04-05T20:24:35.019087+00:00",
                    "state": "73.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "1bc30805ca544a389eeb10868c48dfac",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:27:41.010781+00:00",
                    "last_updated": "2020-04-05T20:27:41.010781+00:00",
                    "state": "73.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "34a4be91485c45eeaf5718033f753c1d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:33:22.022680+00:00",
                    "last_updated": "2020-04-05T20:33:22.022680+00:00",
                    "state": "73.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b5bc1c30b499486082baf177236b0bd9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:39:34.020039+00:00",
                    "last_updated": "2020-04-05T20:39:34.020039+00:00",
                    "state": "73.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "445c447f934f44ca9a214e86cf9cbaa9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:42:40.013855+00:00",
                    "last_updated": "2020-04-05T20:42:40.013855+00:00",
                    "state": "73.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e18fe374d25e4474aa0d7a5457efc4a1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:51:58.021182+00:00",
                    "last_updated": "2020-04-05T20:51:58.021182+00:00",
                    "state": "73.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "dab136109eb8489fa34a708887c48d98",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T20:58:10.016596+00:00",
                    "last_updated": "2020-04-05T20:58:10.016596+00:00",
                    "state": "73.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "1bdda5ee6ae742f7b159455bbdbcfdb4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:03:51.010065+00:00",
                    "last_updated": "2020-04-05T21:03:51.010065+00:00",
                    "state": "73.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "59028ea6500e47ecaad5a27b3e5b1d1d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:19:21.020482+00:00",
                    "last_updated": "2020-04-05T21:19:21.020482+00:00",
                    "state": "72.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "cb08b9d933a8410eb42086b9dbf68923",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:22:26.043910+00:00",
                    "last_updated": "2020-04-05T21:22:26.043910+00:00",
                    "state": "72.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7814e046937b49018cb52cbe649819a3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:28:37.020859+00:00",
                    "last_updated": "2020-04-05T21:28:37.020859+00:00",
                    "state": "72.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3464f52cf58b4f348f883daec6f36aab",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:31:12.574918+00:00",
                    "last_updated": "2020-04-05T21:31:12.574918+00:00",
                    "state": "72.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "04530123564c4c2783c02bea95cac7af",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:34:18.019287+00:00",
                    "last_updated": "2020-04-05T21:34:18.019287+00:00",
                    "state": "72.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9c76d8bd34534f35b4db347434dc92b6",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:37:24.022298+00:00",
                    "last_updated": "2020-04-05T21:37:24.022298+00:00",
                    "state": "72.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "59d9fdfbab764e9e9f9c17b629252b48",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:49:48.020339+00:00",
                    "last_updated": "2020-04-05T21:49:48.020339+00:00",
                    "state": "72.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "602a862b56c64b15a02b27ee2e1e5470",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T21:52:54.026591+00:00",
                    "last_updated": "2020-04-05T21:52:54.026591+00:00",
                    "state": "72.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0e6632ef1dad431387abfaa808c0c33a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:01:41.788268+00:00",
                    "last_updated": "2020-04-05T22:01:41.788268+00:00",
                    "state": "72.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "c702839dc107404ba4dd2eb0bbd74149",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:04:47.017209+00:00",
                    "last_updated": "2020-04-05T22:04:47.017209+00:00",
                    "state": "72.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3f37f1e3903642689fa442405b56ec85",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:10:59.011864+00:00",
                    "last_updated": "2020-04-05T22:10:59.011864+00:00",
                    "state": "72.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "cc802e7039c7406ca1ee15eea23aaedf",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:17:11.021277+00:00",
                    "last_updated": "2020-04-05T22:17:11.021277+00:00",
                    "state": "72.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f6bade89281848a5a163369c3247ab7d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:20:17.012331+00:00",
                    "last_updated": "2020-04-05T22:20:17.012331+00:00",
                    "state": "72.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "bd0778c6e9744b76a7de99c6226675c4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:26:29.012065+00:00",
                    "last_updated": "2020-04-05T22:26:29.012065+00:00",
                    "state": "72.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e1df208c344b4816875b4fed29f7d9b4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:29:35.012261+00:00",
                    "last_updated": "2020-04-05T22:29:35.012261+00:00",
                    "state": "72.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "01bed69417d047fc9d4d523b52ae53bf",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:44:34.011842+00:00",
                    "last_updated": "2020-04-05T22:44:34.011842+00:00",
                    "state": "72.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "c0a992bd6f314e85910b23660af06394",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T22:56:58.011831+00:00",
                    "last_updated": "2020-04-05T22:56:58.011831+00:00",
                    "state": "72.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f1ea36b1da6f460d94408c66240dd90a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T23:03:10.013883+00:00",
                    "last_updated": "2020-04-05T23:03:10.013883+00:00",
                    "state": "72.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d7503f5feef444b98990f22d0877e1b8",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T23:11:57.011974+00:00",
                    "last_updated": "2020-04-05T23:11:57.011974+00:00",
                    "state": "72.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ab0317d3653a4bc28be098b13f922b3b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T23:21:15.021840+00:00",
                    "last_updated": "2020-04-05T23:21:15.021840+00:00",
                    "state": "72.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "533a4dd2e71041c1a0f78bdec7636bfe",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T23:48:38.019965+00:00",
                    "last_updated": "2020-04-05T23:48:38.019965+00:00",
                    "state": "72.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d2d6f4fdff674afca490e7e5ca66aa8b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-05T23:54:50.021520+00:00",
                    "last_updated": "2020-04-05T23:54:50.021520+00:00",
                    "state": "71.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a0912c0559944386bef09be04f627fab",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:01:01.014649+00:00",
                    "last_updated": "2020-04-06T00:01:01.014649+00:00",
                    "state": "71.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ce584550fe4941c29e3fd32292014b20",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:04:07.013244+00:00",
                    "last_updated": "2020-04-06T00:04:07.013244+00:00",
                    "state": "71.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f4cc365bdd6443599298d7af966235fb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:09:48.011472+00:00",
                    "last_updated": "2020-04-06T00:09:48.011472+00:00",
                    "state": "71.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e60c6ad81f1748f9b56a861692481bbb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:12:54.036961+00:00",
                    "last_updated": "2020-04-06T00:12:54.036961+00:00",
                    "state": "71.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9b87b598a4ea49639ab827f8e259f816",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:19:06.017605+00:00",
                    "last_updated": "2020-04-06T00:19:06.017605+00:00",
                    "state": "71.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "293dcbaf869a4c518eb5187d9eaecc2b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:22:12.011086+00:00",
                    "last_updated": "2020-04-06T00:22:12.011086+00:00",
                    "state": "71.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "388809c2eb0349d295e800dd6c299c97",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:31:30.025416+00:00",
                    "last_updated": "2020-04-06T00:31:30.025416+00:00",
                    "state": "71.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "215e7d1626494bc1b2fbfd59e2690251",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:34:36.011291+00:00",
                    "last_updated": "2020-04-06T00:34:36.011291+00:00",
                    "state": "71.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6750eee798504cd9944b749bc075c702",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:49:35.021957+00:00",
                    "last_updated": "2020-04-06T00:49:35.021957+00:00",
                    "state": "71.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "666b733c07ff4f36bc2c55f3355a7902",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T00:58:53.010730+00:00",
                    "last_updated": "2020-04-06T00:58:53.010730+00:00",
                    "state": "70.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "aa5da706a48e4d0ead58d31cd6ee2cae",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:05:05.022795+00:00",
                    "last_updated": "2020-04-06T01:05:05.022795+00:00",
                    "state": "70.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "01f354ced9fe4ca8af3c057d213b5c61",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:14:23.013470+00:00",
                    "last_updated": "2020-04-06T01:14:23.013470+00:00",
                    "state": "70.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "feee15d6c2d84ca8aa7c63dffad71f43",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:23:09.021725+00:00",
                    "last_updated": "2020-04-06T01:23:09.021725+00:00",
                    "state": "70.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "c537fe39d0794646bd271e3169140b55",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:29:21.014541+00:00",
                    "last_updated": "2020-04-06T01:29:21.014541+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b4581534b94c43d2a8cb30c8e9705cbc",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:38:39.012748+00:00",
                    "last_updated": "2020-04-06T01:38:39.012748+00:00",
                    "state": "70.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "09029bf278b345eea8af4004f1eb0a29",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:50:31.014878+00:00",
                    "last_updated": "2020-04-06T01:50:31.014878+00:00",
                    "state": "70.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4f0a1a637f32488b83b8bfb3ceea6216",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T01:59:49.013641+00:00",
                    "last_updated": "2020-04-06T01:59:49.013641+00:00",
                    "state": "70.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b2a6dcc0b1a34aceb04b97fded560041",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:06:01.019259+00:00",
                    "last_updated": "2020-04-06T02:06:01.019259+00:00",
                    "state": "70.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "71a1229f4e2148cca7759c454a8cd30e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:12:13.011747+00:00",
                    "last_updated": "2020-04-06T02:12:13.011747+00:00",
                    "state": "70.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "cf8779a41fcd4f1ca33a29814cf5f46c",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:21:00.012902+00:00",
                    "last_updated": "2020-04-06T02:21:00.012902+00:00",
                    "state": "69.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b3024d2c7ff04790a1c52133a93939c6",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:24:06.011808+00:00",
                    "last_updated": "2020-04-06T02:24:06.011808+00:00",
                    "state": "69.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "1bc1820975dd40d69f2db95ca701c9a1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:30:17.015329+00:00",
                    "last_updated": "2020-04-06T02:30:17.015329+00:00",
                    "state": "69.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "57b2091d3b244ca0a367b34259cf8b41",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:33:23.013199+00:00",
                    "last_updated": "2020-04-06T02:33:23.013199+00:00",
                    "state": "69.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6404ffced1284af9b4119d6babc56aab",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:36:29.012034+00:00",
                    "last_updated": "2020-04-06T02:36:29.012034+00:00",
                    "state": "69.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "990da4038e794cc98ae92779f7e81687",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:39:35.013364+00:00",
                    "last_updated": "2020-04-06T02:39:35.013364+00:00",
                    "state": "69.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9c5d334f41394cca99aa62abb810309e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:45:47.012420+00:00",
                    "last_updated": "2020-04-06T02:45:47.012420+00:00",
                    "state": "69.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a8fb8b5b3104451e9c02f3dc93f658d1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:51:28.012410+00:00",
                    "last_updated": "2020-04-06T02:51:28.012410+00:00",
                    "state": "69.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a8dc867c34cf4b568e3570316dd7c3fd",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T02:54:33.007076+00:00",
                    "last_updated": "2020-04-06T02:54:33.007076+00:00",
                    "state": "69.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d41963f925464f76832e629e1befa55b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:01:16.012322+00:00",
                    "last_updated": "2020-04-06T03:01:16.012322+00:00",
                    "state": "69.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "361251e7c5ec4710947413e41d0030d8",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:06:57.013434+00:00",
                    "last_updated": "2020-04-06T03:06:57.013434+00:00",
                    "state": "68.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ca03dc0d5215488383bbca7397d97af5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:16:15.015016+00:00",
                    "last_updated": "2020-04-06T03:16:15.015016+00:00",
                    "state": "68.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a0bf03d275364f818394e4f8211f5b46",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:31:45.013030+00:00",
                    "last_updated": "2020-04-06T03:31:45.013030+00:00",
                    "state": "68.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ea96456cca6b441fb8acc3423788039b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:43:38.013001+00:00",
                    "last_updated": "2020-04-06T03:43:38.013001+00:00",
                    "state": "68.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0a5325b00a6b42aa88be5560b2c3b4a0",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T03:52:25.016507+00:00",
                    "last_updated": "2020-04-06T03:52:25.016507+00:00",
                    "state": "68.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a453bdf1d2fe4725ad41c6676d5743aa",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T04:04:49.011293+00:00",
                    "last_updated": "2020-04-06T04:04:49.011293+00:00",
                    "state": "68.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2402d19e33414768b29317afee4f2d8c",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T04:11:01.011534+00:00",
                    "last_updated": "2020-04-06T04:11:01.011534+00:00",
                    "state": "68.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "821c0de6352a43dca8957abc0b9b58d3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T04:20:19.014575+00:00",
                    "last_updated": "2020-04-06T04:20:19.014575+00:00",
                    "state": "68.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b88d74871da94c3eba7f33a28b01fb06",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T04:29:06.016339+00:00",
                    "last_updated": "2020-04-06T04:29:06.016339+00:00",
                    "state": "67.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0e301e1a7f494e65908b5bda521ff927",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T04:32:12.012670+00:00",
                    "last_updated": "2020-04-06T04:32:12.012670+00:00",
                    "state": "67.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "f82de26ba9544228ba3937a89d1601e2",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:02:41.014381+00:00",
                    "last_updated": "2020-04-06T05:02:41.014381+00:00",
                    "state": "67.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2943a4b03ae94426ad2932c783f2435b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:11:59.011257+00:00",
                    "last_updated": "2020-04-06T05:11:59.011257+00:00",
                    "state": "67.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "096d1797053943be8c8fdbfeb0a98c73",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:21:17.012992+00:00",
                    "last_updated": "2020-04-06T05:21:17.012992+00:00",
                    "state": "67.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "027de94076db4756ad52db1bfb623e93",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:30:03.021378+00:00",
                    "last_updated": "2020-04-06T05:30:03.021378+00:00",
                    "state": "67.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "86f23c5cfe6d4a30be03110d37a4f069",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:33:09.012374+00:00",
                    "last_updated": "2020-04-06T05:33:09.012374+00:00",
                    "state": "67.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0453dbe0865f4cb48d1cb4dbcfb55250",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:39:21.012214+00:00",
                    "last_updated": "2020-04-06T05:39:21.012214+00:00",
                    "state": "67.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2b0536c3972d4e55880cd19fa0d221e4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:45:33.013510+00:00",
                    "last_updated": "2020-04-06T05:45:33.013510+00:00",
                    "state": "67.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "984e9c1fdb674ff4bea3fca70d7270e8",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:51:45.013222+00:00",
                    "last_updated": "2020-04-06T05:51:45.013222+00:00",
                    "state": "66.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6942243057194e7ebd69136d7009d41d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T05:57:57.013573+00:00",
                    "last_updated": "2020-04-06T05:57:57.013573+00:00",
                    "state": "66.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3f8ebd6dc7914428899e0df83e6c4e0c",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:03:37.027996+00:00",
                    "last_updated": "2020-04-06T06:03:37.027996+00:00",
                    "state": "66.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "20d6df6ef8ad417bb3adc0b1b38fe2bc",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:31:30.023753+00:00",
                    "last_updated": "2020-04-06T06:31:30.023753+00:00",
                    "state": "66.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "429178a1fdc64ef18bc59ccd33d7fc1e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:40:17.020913+00:00",
                    "last_updated": "2020-04-06T06:40:17.020913+00:00",
                    "state": "66.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a9b792a420214b4aa6d9a951c4429ba5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:49:34.021168+00:00",
                    "last_updated": "2020-04-06T06:49:34.021168+00:00",
                    "state": "66.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4963e46ed95244a4b55793a5ff813dde",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:55:46.020898+00:00",
                    "last_updated": "2020-04-06T06:55:46.020898+00:00",
                    "state": "66.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "266279af6cc2470081d367ad62fafd65",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T06:58:52.011858+00:00",
                    "last_updated": "2020-04-06T06:58:52.011858+00:00",
                    "state": "66.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "2887f19ce0ea47abb72fb1849d8d1a81",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:07:39.021667+00:00",
                    "last_updated": "2020-04-06T07:07:39.021667+00:00",
                    "state": "66.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0901db25b9aa4c5aba72d197929ca02c",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:13:51.023331+00:00",
                    "last_updated": "2020-04-06T07:13:51.023331+00:00",
                    "state": "65.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b7b938efbfd34eb6842ffb0ea8b60299",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:20:03.029485+00:00",
                    "last_updated": "2020-04-06T07:20:03.029485+00:00",
                    "state": "65.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ac999174b5494d5a97b2d53e48295976",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:32:27.021937+00:00",
                    "last_updated": "2020-04-06T07:32:27.021937+00:00",
                    "state": "65.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "400fc53768b54b3aac2e874fcfc595c2",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:38:08.022030+00:00",
                    "last_updated": "2020-04-06T07:38:08.022030+00:00",
                    "state": "65.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b941803dcaa24c66a5556de1061d752b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T07:56:44.023095+00:00",
                    "last_updated": "2020-04-06T07:56:44.023095+00:00",
                    "state": "65.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "5cbe3966f1d44e0eb651297b39df401d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:06:02.023964+00:00",
                    "last_updated": "2020-04-06T08:06:02.023964+00:00",
                    "state": "65.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ff07484085054c6cb17caa2e0610acf5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:09:08.019727+00:00",
                    "last_updated": "2020-04-06T08:09:08.019727+00:00",
                    "state": "65.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "adb8a0e8ba334de3836c8f9b4f43a173",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:14:48.019079+00:00",
                    "last_updated": "2020-04-06T08:14:48.019079+00:00",
                    "state": "65.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "98831f518b944e098234ca8b6a50c2a8",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:21:00.030736+00:00",
                    "last_updated": "2020-04-06T08:21:00.030736+00:00",
                    "state": "65.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d45191b7533a4173a7eab2edcb31ef45",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:33:24.026791+00:00",
                    "last_updated": "2020-04-06T08:33:24.026791+00:00",
                    "state": "64.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "70afb74874f2495c8f903ad1a8cc7e06",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:36:30.020707+00:00",
                    "last_updated": "2020-04-06T08:36:30.020707+00:00",
                    "state": "64.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "5125baa38838447a92b01d992417b570",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:39:35.020741+00:00",
                    "last_updated": "2020-04-06T08:39:35.020741+00:00",
                    "state": "64.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3395365136434f9380b705a5d7574db2",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:48:21.020779+00:00",
                    "last_updated": "2020-04-06T08:48:21.020779+00:00",
                    "state": "64.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "fe046ed64b7844a08f60e63a5fbc31f7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T08:54:33.022746+00:00",
                    "last_updated": "2020-04-06T08:54:33.022746+00:00",
                    "state": "64.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "9fe365faf79d4bdea16540786002ef2f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:00:45.022690+00:00",
                    "last_updated": "2020-04-06T09:00:45.022690+00:00",
                    "state": "64.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ce46c344f5f544ef863e05d6b669e290",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:06:57.021855+00:00",
                    "last_updated": "2020-04-06T09:06:57.021855+00:00",
                    "state": "64.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4ef6421acd504988b415151ae3d26a7a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:18:50.025014+00:00",
                    "last_updated": "2020-04-06T09:18:50.025014+00:00",
                    "state": "64.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b5b91bc9ef384fab997eb01a145da14f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:21:56.018242+00:00",
                    "last_updated": "2020-04-06T09:21:56.018242+00:00",
                    "state": "64.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "eefa30a9ce6346b6b2eed03ba7f2d7ed",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:25:02.017585+00:00",
                    "last_updated": "2020-04-06T09:25:02.017585+00:00",
                    "state": "64.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "c997deb4cdbd413ca27c1654055c0ace",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:28:08.021987+00:00",
                    "last_updated": "2020-04-06T09:28:08.021987+00:00",
                    "state": "64.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e635740306b4420bafd9901312c72113",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:34:20.031027+00:00",
                    "last_updated": "2020-04-06T09:34:20.031027+00:00",
                    "state": "65.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "fdc17ccb463941378612290c31bfb79f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:37:26.023438+00:00",
                    "last_updated": "2020-04-06T09:37:26.023438+00:00",
                    "state": "65.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "403b81384c78423db6622a7309693da4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:40:32.023647+00:00",
                    "last_updated": "2020-04-06T09:40:32.023647+00:00",
                    "state": "65.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4c5c35b40cab4243bc4745074a096242",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:43:38.028386+00:00",
                    "last_updated": "2020-04-06T09:43:38.028386+00:00",
                    "state": "66.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "e09d4f4818de4d399f5a7a542be81135",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:46:13.015593+00:00",
                    "last_updated": "2020-04-06T09:46:13.015593+00:00",
                    "state": "66.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "8fded1fd6a24408785d0375ded994be1",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:49:19.023041+00:00",
                    "last_updated": "2020-04-06T09:49:19.023041+00:00",
                    "state": "66.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4ecd94141cc5418ebc17bd251e52fe4f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:52:25.026074+00:00",
                    "last_updated": "2020-04-06T09:52:25.026074+00:00",
                    "state": "66.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "66fc48ec7d4b48f7b4229d584a161a29",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:55:30.021453+00:00",
                    "last_updated": "2020-04-06T09:55:30.021453+00:00",
                    "state": "67.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a37395e72a2e4ae8b7733aa01a81cedf",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T09:58:36.027790+00:00",
                    "last_updated": "2020-04-06T09:58:36.027790+00:00",
                    "state": "67.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3bdbc8b9b0424f58b09d062454588ac7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:01:42.026979+00:00",
                    "last_updated": "2020-04-06T10:01:42.026979+00:00",
                    "state": "67.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0dddf223b39e455093523c875a7a25a3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:04:48.019122+00:00",
                    "last_updated": "2020-04-06T10:04:48.019122+00:00",
                    "state": "68.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "5e925c98f1dd4cc3bb30adbe3a134d08",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:07:54.025275+00:00",
                    "last_updated": "2020-04-06T10:07:54.025275+00:00",
                    "state": "68.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7dbd06ef5ec7459d913b5dd42a5bef61",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:11:00.027495+00:00",
                    "last_updated": "2020-04-06T10:11:00.027495+00:00",
                    "state": "69.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "28a6c3c32c94448c9da947b618a557b9",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:14:05.037702+00:00",
                    "last_updated": "2020-04-06T10:14:05.037702+00:00",
                    "state": "69.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "29bf63889ffb4eda9918c913d5bdfc64",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:17:11.045517+00:00",
                    "last_updated": "2020-04-06T10:17:11.045517+00:00",
                    "state": "69.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ad05d959e5194148a19d25f2de4ca280",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:19:46.022774+00:00",
                    "last_updated": "2020-04-06T10:19:46.022774+00:00",
                    "state": "69.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6fdc77bd381d4db5a77592dacfc1effb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:22:52.024293+00:00",
                    "last_updated": "2020-04-06T10:22:52.024293+00:00",
                    "state": "68.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "85bc7fa9c08840d1847b594bff12c20a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:25:58.021888+00:00",
                    "last_updated": "2020-04-06T10:25:58.021888+00:00",
                    "state": "68.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6a8f7fd6fa624c4bb95e806748f5fae0",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:29:04.025724+00:00",
                    "last_updated": "2020-04-06T10:29:04.025724+00:00",
                    "state": "68.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "4eae4972afcf43e3b25ae5b17f0f3f01",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:35:16.035837+00:00",
                    "last_updated": "2020-04-06T10:35:16.035837+00:00",
                    "state": "68.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a4f5e00ffc1d4dc5b5c880c273e7bac5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:41:28.026044+00:00",
                    "last_updated": "2020-04-06T10:41:28.026044+00:00",
                    "state": "68.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "97c320e40911401e9e92e5037f120e7f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:44:34.025576+00:00",
                    "last_updated": "2020-04-06T10:44:34.025576+00:00",
                    "state": "68.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "94bf36e928024db9a7fd14e537254b9a",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:47:40.020385+00:00",
                    "last_updated": "2020-04-06T10:47:40.020385+00:00",
                    "state": "69.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "6ce41ae0dd1748aa90f6ce891d0b5e79",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:50:46.039619+00:00",
                    "last_updated": "2020-04-06T10:50:46.039619+00:00",
                    "state": "69.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0a2d011d13f44402a7a65b1ee59b7864",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:53:21.045495+00:00",
                    "last_updated": "2020-04-06T10:53:21.045495+00:00",
                    "state": "69.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3a5344891a1b418aa4f97a99898cbb08",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:56:27.028281+00:00",
                    "last_updated": "2020-04-06T10:56:27.028281+00:00",
                    "state": "70.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "91cbabff8bb44ef5967ac3cbc1d6e352",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T10:59:33.020921+00:00",
                    "last_updated": "2020-04-06T10:59:33.020921+00:00",
                    "state": "70.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "a21407d1b1ba45a58f9505aa3df9c107",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:08:50.021937+00:00",
                    "last_updated": "2020-04-06T11:08:50.021937+00:00",
                    "state": "70.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7f06de8d10534e0baa32cd491fdb90ad",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:11:56.015323+00:00",
                    "last_updated": "2020-04-06T11:11:56.015323+00:00",
                    "state": "70.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "742dee73af8e43bf8214b094cd9476d5",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:15:02.011436+00:00",
                    "last_updated": "2020-04-06T11:15:02.011436+00:00",
                    "state": "69.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "93c4fc44f2994c0b87fcbcad29e621cd",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:21:12.018293+00:00",
                    "last_updated": "2020-04-06T11:21:12.018293+00:00",
                    "state": "70.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0920cc0114a4487c98ddf5d4b68ffe57",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:24:18.028930+00:00",
                    "last_updated": "2020-04-06T11:24:18.028930+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "69d97ee8f95441108f9713dd7b22fb36",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:26:53.027893+00:00",
                    "last_updated": "2020-04-06T11:26:53.027893+00:00",
                    "state": "70.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "68644d1cb49149b586c4414f9a1a39ce",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:36:11.027992+00:00",
                    "last_updated": "2020-04-06T11:36:11.027992+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3eb3de4232ac4c5d915c40579c396f59",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:39:17.020607+00:00",
                    "last_updated": "2020-04-06T11:39:17.020607+00:00",
                    "state": "70.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "ab4b0d625a3d4a54a95c23d636b55cb3",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:42:23.025229+00:00",
                    "last_updated": "2020-04-06T11:42:23.025229+00:00",
                    "state": "70.1"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "7f699c4e0f6f4229b08a2110d2832601",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:45:29.025658+00:00",
                    "last_updated": "2020-04-06T11:45:29.025658+00:00",
                    "state": "70.2"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "14b9be4b0a2a427a8c1424adefad7311",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:51:41.015159+00:00",
                    "last_updated": "2020-04-06T11:51:41.015159+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "84c6c737ebea4bee8d23f7d53bb0281b",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:54:16.027664+00:00",
                    "last_updated": "2020-04-06T11:54:16.027664+00:00",
                    "state": "70.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "fd6b5042704a4bae9d5e071773da796e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T11:57:22.027248+00:00",
                    "last_updated": "2020-04-06T11:57:22.027248+00:00",
                    "state": "71.0"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "3b03697ea6514980a94d7637b086f244",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:00:28.019730+00:00",
                    "last_updated": "2020-04-06T12:00:28.019730+00:00",
                    "state": "70.9"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "12554c69071c402db9aaaf48ba34e1aa",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:03:34.014525+00:00",
                    "last_updated": "2020-04-06T12:03:34.014525+00:00",
                    "state": "70.8"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "343a680df13f4720b401ceea69d9bf97",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:06:40.033828+00:00",
                    "last_updated": "2020-04-06T12:06:40.033828+00:00",
                    "state": "70.6"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "856593a145a6434eb0057b17b68c215e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:09:46.020521+00:00",
                    "last_updated": "2020-04-06T12:09:46.020521+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "740a7473840d46c0b5a6468449f605eb",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:12:52.015018+00:00",
                    "last_updated": "2020-04-06T12:12:52.015018+00:00",
                    "state": "70.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "b8ad10806e0b429ebb96e15b7d42bf2d",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:22:10.023627+00:00",
                    "last_updated": "2020-04-06T12:22:10.023627+00:00",
                    "state": "70.7"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "d50fdd2841a0481db2c329a6ae2e4480",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:31:28.016816+00:00",
                    "last_updated": "2020-04-06T12:31:28.016816+00:00",
                    "state": "70.5"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "c8b41cb7016e4bbdb49b3f058dc3adfd",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:37:09.026850+00:00",
                    "last_updated": "2020-04-06T12:37:09.026850+00:00",
                    "state": "70.3"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "cb20561665044b7da277c91cfd08e73f",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:40:15.017977+00:00",
                    "last_updated": "2020-04-06T12:40:15.017977+00:00",
                    "state": "70.4"
                },
                {
                    "attributes": {
                        "device_class": "temperature",
                        "friendly_name": "Home Temperature",
                        "unit_of_measurement": "°F"
                    },
                    "context": {
                        "id": "0ed9fa30b24743b0a15b11a26852241e",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "sensor.home_temperature",
                    "last_changed": "2020-04-06T12:43:21.023788+00:00",
                    "last_updated": "2020-04-06T12:43:21.023788+00:00",
                    "state": "70.7"
                }
            ]
        ]
        `
        return JSON.parse(mockData);
    }
}