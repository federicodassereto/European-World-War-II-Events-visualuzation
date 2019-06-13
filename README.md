# European-World-War-II-Events-Visualization

An interactive visualization of the events occured in Europe during the Second World War.

> "If understanding is impossible, knowing is imperative"
> - Primo Levi

![Alt text](home.png?raw=true "Home visualization")

This visualization has been developed as final project of the Data Visualization course of "Università degli Studi di Genova", during the Master in Data Science and Engineering.


## Getting Started

Download and extract the content of the project, or alternatively:

```
git clone https://github.com/federicodassereto/European-World-War-II-Events-visualuzation.git
```

To run the visualization, a web server is required.

## Related notes

The project has been developed using d3.js (version 3). This version of the library is included in the folder d3/ .


## Getting Ready

The visualization provides and interactive map of Europe between May, 1939 and May, 1945.

The top menu allows users to choose among different kind of visualization:
  * Home, territorial domains and sides for each country during the war;
  * Factions, a description of how long each country stayed in a specific faction;
  * Deaths, total deaths during the war period;
  * Holocaust, total jewish deaths during the war period.


### Home
The left side of the visualization allows users to select a country and visualize a brief description of its action during the war. It is also possible to move back and forth in time exploiting the timeline on the bottom, which is zoomable and draggable, to change the map at month granularity. While moving in time, the map changes with respect to the events. Also the countries are differently colored over time.

### Factions

### Deaths
The classical home map is colored with a logarithmic green-scale and it is associated with a bubble chart in the right side. The bubble chart is interactive too, hovering over a bubble shows the name of the country and the total deaths count. While moving on the map, hovering a country leads to the higlight of the corresponding bubble in the right panel.

### Holocaust
Similarly to the Deaths window, the map is colored with a logarithmic violet-scale and it is associated with a bubble chart in the right side. All the features provided in the previous visualization are replicated.
