#!/usr/bin/env babel-node

/* jshint esnext: true */

'use strict';

var path    = require('path');
var fs      = require('fs');
var through = require('through');
var split   = require('split');

function pfx(str) { return function(d) { return   str + ":" + d; }; }

let allTags = [];
allTags = allTags.concat('cartesian,polar,iso,ternary,2d,3d,geo,constrained,generative'.split(',').map(pfx('coord')));
allTags = allTags.concat('category,correlation,density,hierarchy,relationship,spread,summary'.split(',').map(pfx('info')));
allTags = allTags.concat('lib,plugin,component'.split(',').map(pfx('r')));
allTags = allTags.concat('delete,thumb-missing,broken'.split(','));
allTags = allTags.concat('preview,thumbnail'.split(',').map(pfx('r')));

// plants
let allTerms = [];
allTerms = allTerms.concat('plugin,component,tuto,icon,boilerplate'.split(',').map(pfx('fn')));
allTerms = allTerms.concat('visualisation,gaming'.split(',').map(pfx('fn')));
allTerms = allTerms.concat('map,treemap,chord,gant,force-directed,cartogram,diagram,drawing,wire-diagram,arc-diagram,dendrogram'.split(',').map(pfx('lay')));
allTerms = allTerms.concat('sunburst,word-cloud,parallel-coord,cartogram,bullet,violin,steamgraph,scatterplot,sankey,radar,hive,hemicycle'.split(',').map(pfx('lay')));
allTerms = allTerms.concat('pie,donut,histogram,contour-line,matix,table,fishbone,tree,choropleth,quadtree,gauge,slider,map,slope,swim-lane'.split(',').map(pfx('lay')));
allTerms = allTerms.concat('calendar'.split(',').map(pfx('lay')));
allTerms = allTerms.concat('bar,area,dot,square,line,hex,triangle,visual-vibration,lollipop,flower,blob'.split(',').map(pfx('gshape')));
allTerms = allTerms.concat('time,color,alpha,size,heatmap,symbol,heightmap,texture,chernoff'.split(',').map(pfx('gscale')));
allTerms = allTerms.concat('legend,scale,axis,guide,label'.split(',').map(pfx('geom')));
allTerms = allTerms.concat('dashboard,lattice,panel,stacked,linked,bounded,multi-foci,small-multiples,partition,grid'.split(',').map(pfx('gp')));
// geometry
allTerms = allTerms.concat('linear-algebra,countour,triangulation,delaunay,voronoi,intersect,superformula,bundle'.split(',').map(pfx('algo')));
allTerms = allTerms.concat('space-filling,l-system,generative,hilbert,ulam,wilson,prim,tesselation,hull-convex,hull-concave'.split(',').map(pfx('algo')));
// 3d
allTerms = allTerms.concat('map-projection'.split(',').map(pfx('algo')));
// maths
allTerms = allTerms.concat('physics,interpolate'.split(',').map(pfx('algo')));
// stats
allTerms = allTerms.concat('binning,pca,regression,correlation,probability'.split(',').map(pfx('algo')));
// matchine learning
allTerms = allTerms.concat('kmeans,cluster,centrality,betweeness'.split(',').map(pfx('algo')));
allTerms = allTerms.concat('random-forest,svm'.split(',').map(pfx('algo')));
allTerms = allTerms.concat('img-processing,nearest-neighbour,kernel-density,random-walk,monte-carlo'.split(',').map(pfx('algo')));
// nlp
allTerms = allTerms.concat('sentiment,stemmer,dirichlet'.split(',').map(pfx('algo')));
// layout
allTerms = allTerms.concat('fisheye,constraints,packing,gosper'.split(',').map(pfx('algo')));
allTerms = allTerms.concat('diff,patch'.split(',').map(pfx('fmt')));
allTerms = allTerms.concat('math,stats,nlp,machine-learning,computer-vision'.split(',').map(pfx('subject')));
allTerms = allTerms.concat('event,real-time,async,reactive,observe-or-bind,immutable'.split(',').map(pfx('flow')));
allTerms = allTerms.concat('micro'.split(',').map(pfx('size')));
allTerms = allTerms.concat('gh,gist,codepen,tributary'.split(',').map(pfx('src')));
allTerms = allTerms.concat('R,python,lua,haskell,coffeescript,elm,js,cypher,sql'.split(',').map(pfx('lg')));
allTerms = allTerms.concat('fn,oo'.split(',').map(pfx('pg')));
allTerms = allTerms.concat('modular,flux'.split(',').map(pfx('arch')));
allTerms = allTerms.concat('webgl,svg,css,canvas'.split(',').map(pfx('surf')));
allTerms = allTerms.concat('jq,d3,ember,ender,ng,ng2,react,backbone,grunt,gulp,html5,css3,ext,three'.split(',').map(pfx('+')));
allTerms = allTerms.concat('search,sort,filter,pick,parse,navigate,scrape,measure,load,suggest,classify,i18n,l10n'.split(',').map(pfx('action')));
allTerms = allTerms.concat('image,graphics,audio,video,font,color,text'.split(',').map(pfx('m')));
allTerms = allTerms.concat('browser,server,node,mobile,isomorphic,board,desktop'.split(',').map(pfx('env')));
allTerms = allTerms.concat('store,file,mouse,keyboard'.split(',').map(pfx('io')));
allTerms = allTerms.concat('document,build,transpile,test,task,optimize'.split(',').map(pfx('deploy')));
allTerms = allTerms.concat('vector,matrix,tuple,coll,array,typed-array,object,graph'.split(',').map(pfx('struct')));
allTerms = allTerms.concat('carto,mapbox,leaflet,gmap,turf,openstreetmap'.split(',').map(pfx('api')));
allTerms = allTerms.concat('csv,json,geojson,gexf,sparse-matrix,topojson,xml,tsv,rdf,turtle,json-ld'.split(',').map(pfx('std')));
allTerms = allTerms.concat('aus,nzl,usa'.split(',').map(pfx('country')));
allTerms = allTerms.concat('sketchy'.split(',').map(pfx('style')));
allTerms = allTerms.concat('brush,drag,pan,zoom,editable,resizeable,collapsible,highlight,tooltip'.split(',').map(pfx('deco')));
allTerms = allTerms.concat('animate,sedimentation,gooey,scroll'.split(',').map(pfx('trans')));
allTerms = allTerms.concat('geometry'.split(',').map(pfx('cx')));
allTerms = allTerms.concat('sport,social,food'.split(',').map(pfx('s')));


var tsvStream = fs.createWriteStream('js-assets.tsv')
fs.createReadStream('js-assets.nedb', {objectMode: true})
    .pipe(split())
    .pipe(through(function(line) {
      var strm = this;
      if(!line || !line.length) { return; }
      var {p,name,tags,terms,others,url, description} = JSON.parse(line);
      if(!Array.isArray(others)) { others = []; }

      tags = tags.reduce((acc, d, i) => {
        if(allTags.includes(d)) {
          acc.push(d);
        } else {
          others.push(d);
        }
        return acc;
      }, []);
      terms = terms.reduce((acc, d, i) => {
        if(allTerms.includes(d)) {
          if(!['src:gist'].includes(d)) {
            acc.push(d);
          }
        } else {
          if((d || '').indexOf(':') !== -1) {
            // console.log(d);
            d = d.replace(/^s:/, '');
          }
            others.push(d);
        }
        return acc;
      }, []);
      var short = (url || '').replace('http://bl.ocks.org/', '');
      var fmt = '';
      if(p.includes('snapshot')) { fmt = 's'; }
      if(p.includes('thumbnail.png')) {
        fmt = 'gtb:' + p.replace('https://gist.githubusercontent.com/', '').replace(short, '').replace('/raw/','').replace('/thumbnail.png','');
        console.log(fmt)
       }
       var line = [short, name, description, fmt,tags.join(';'),terms.join(';'),others.join(';')].join('\t');
       // 1wheel/0fe7b82d7c188c2d26a3	s	coord:cartesian	lg:d3;lg:svg;algo:nest;std:csv;geom:axis;gshape:line	d3.time.wednesdays;d3.time.day;d3.time.wednesday;d3.time.format;d3.time.scale;d3.time;Classic;Cubs
       console.log(line)
      strm.queue(line + '\n')
    }))
    .pipe(tsvStream);
