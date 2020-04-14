import { Component, Inject, OnInit, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as Chart from 'chart.js';
import * as Hammer from 'hammerjs';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environments/environment';


interface StackedChartModalData {
    entity_id: string;
    friendly_name: string;
    off_value: string;
    on_value?: string;
}

@Component({
    selector: 'chart-modal',
    template: `    
        <div id="dialog-cont" style="width: 100%; height: 100%;">    
        
            <canvas id="canvas" ></canvas>    
        </div>
    `,
})
export class StackedChartModal implements OnInit {

    chart: Chart;
    labels = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: StackedChartModalData,
        private dialogRef: MatDialogRef<StackedChartModal>,
        private http: HttpService
    ) { }

    ngOnInit() {
        this.labels.push(this.data.off_value);
        if (this.data.on_value) this.labels.push(this.data.on_value);
        let hammertime = new Hammer(document.getElementById('dialog-cont'));
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
        hammertime.on('swipe', ev => {
            if (ev.deltaY > 0) this.dialogRef.close();
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
        data[0].forEach((point, index, array) => {
            if (index == 0) return;
            // let ganttData = [];
            // let val = this.convertToNumber(data[0][index - 1].state);
            if (!this.labels.includes(data[0][index - 1].state)) this.labels.push(data[0][index - 1].state);
            let val = this.labels.findIndex(label => label == data[0][index - 1].state) + 1;
            graphData.push({ x: new Date(data[0][index - 1].last_updated), y: val })
            graphData.push({ x: new Date(point.last_updated), y: val })
            if (index == array.length - 1) graphData.push({ x: new Date(), y: val})



        });

        console.log(this.labels);
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
                    fill: true,
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
                    }],
                    yAxes: [{
                        // stacked: true
                        // scaleLabel: {
                        //     display: false
                        // },
                        ticks: {
                            min: 0,
                            max: 2,
                            stepSize: 1,
                            callback: (label, index, labels) => {
                                console.log(label)
                                if (label == 0) return null;
                                return this.labels[label - 1];
                            }
                        }
                    }]
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

                elements: {
                    line: {
                        tension: 0
                    },
                    point: {
                        radius: 0,
                    },
                }
            }


        });
    }

    convertToNumber(text: string) {
        switch (text.toLowerCase()) {
            case 'true': case 'yes': case '1': case 'on': return 2
            default: return 1
        }
    }

    getMockData(): any {
        let mockData = `
        [
            [
                {
                    "attributes": {
                        "editable": true,
                        "friendly_name": "David",
                        "gps_accuracy": 15,
                        "id": "af58192e2020458f890382116f8ca84f",
                        "latitude": 39.373514,
                        "longitude": -84.379416,
                        "source": "device_tracker.life360_david"
                    },
                    "context": {
                        "id": "f113c3d8bb824e90879ad06d82e241d7",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "person.david",
                    "last_changed": "2020-04-06T10:42:20.017155+00:00",
                    "last_updated": "2020-04-06T10:42:20.017155+00:00",
                    "state": "not_home"
                },
                {
                    "attributes": {
                        "editable": true,
                        "friendly_name": "David",
                        "gps_accuracy": 15,
                        "id": "af58192e2020458f890382116f8ca84f",
                        "latitude": 39.323932,
                        "longitude": -84.455157,
                        "source": "device_tracker.life360_david"
                    },
                    "context": {
                        "id": "ba6b5bafb0aa4a7fb0f7a6219f02a9f4",
                        "parent_id": null,
                        "user_id": null
                    },
                    "entity_id": "person.david",
                    "last_changed": "2020-04-06T10:52:03.248709+00:00",
                    "last_updated": "2020-04-06T10:52:03.248709+00:00",
                    "state": "APTech"
                }
            ]
        ]
        `
        return JSON.parse(mockData);
    }
}