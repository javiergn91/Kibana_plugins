import {VisFactoryProvider} from 'ui/vis/vis_factory';
import {VisTypesRegistryProvider} from 'ui/registry/vis_types';
import {Schemas} from 'ui/vis/editors/default/schemas';
import optionsTemplate from './options_template.html';
import ExampleVisView from './example_vis.html';
import $ from 'jquery';
import './style.css';

class MyVisualization {
    constructor(el, vis) {
        this.el = el;
        this.vis = vis;
        this.container = document.createElement('div');
        this.container.className = 'myvis-container-div';
        this.el.appendChild(this.container);
    }

    async render(visData, status) {
        var count = 0;

        let bucketCol = "";
        let dataCol = "";
        let thresholdName = this.vis.params.thresholdName;
        let thresholdValue = this.vis.params.thresholdValue;

        visData.columns.forEach(function(column, i) {
            if(typeof column.aggConfig.__schema != "undefined")
            {
                let colName = column.aggConfig.__schema.name;
                
                if(colName == "segment") 
                    bucketCol = column.id;

                if(colName == "trafficlight")
                    dataCol = column.id;
            }
        });

        let total = 0;
        let threshold = 0;

        visData.rows.forEach(function(row) {
            console.log(row);
            console.log(row[bucketCol] + ", " + row[dataCol]);

            if(thresholdName == row[bucketCol]) {
                threshold = parseInt(row[dataCol]);
            }

            total += parseInt(row[dataCol]);
        });

        console.log(total + ", " + threshold);
        
        this.container.innerHTML = ExampleVisView;

        var bulbs = $(".myvis-container-div .bulb");
        $(bulbs).removeClass("stopLight goLight slowLight offLight");

        var color = "Red";

        if(total == thresholdValue) {
            color = "Green";
        } else if(total * thresholdValue < threshold) {
            color = "Yellow";            
        }

        $(bulbs).each(function(index, item) {
            switch(color) {
                case "Red": if(index == 0) $(item).addClass("stopLight"); break;
                case "Yellow": if(index == 1) $(item).addClass("slowLight"); break;
                case "Green": if(index == 2) $(item).addClass("goLight"); break;
                default:
                    $(item).addClass("offLight");
            }
        });
    }

    destroy() {
        this.el.innerHTML = "";
    }
}

const myNewVisType = (Private) => {
    const visFactory = Private(VisFactoryProvider);

    return visFactory.createBaseVisualization({
        name: 'my_new_vis',
        title: 'My New Vis',
        icon: 'fa-bar-chart',
        description: "Cool new chart",
        visualization: MyVisualization,
        visConfig: {
            defaults: {
                fontSize: 30,
                color: "Red"
            }
        },
        editorConfig: {
            optionsTemplate: optionsTemplate,
            schemas: new Schemas([
            {
                group: 'metrics',
                name: 'trafficlight',
                title: 'metrics title',
                min: 1,
                aggFilter: ["count"],
                defaults: [{
                    type: 'count',
                    schema: 'metric'
                }]
            },
            {
                group: "buckets",
                name: "segment",
                title: "Bucket Split",
                aggFilter: ["terms"]
            }])
        }
    });
}

VisTypesRegistryProvider.register(myNewVisType);