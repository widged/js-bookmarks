/* jshint esnext: true */

class BookmarksImporter {

  load(file, asyncReturn) {

    xhr(file, (tsv) => {

        var aTags = new Set(), aTerms = new Set();
        var db = tsv.split("\n").reduce((acc, d, i) => {
        if(d.length) {
          // 	line graph with multipe datapoints		coord:cartesian	fn:visualisation;lg:js;+:d3;gscale:time	time-series;line-graph with multipe datapoints
          var [src, name, description,fmt, tags, terms, others] = d.split('\t');
          tags = (tags || '').split(';');
          tags.forEach((t) => { aTags.add(t); });
          terms = (terms || '').split(';');
          // console.log(src)
          terms.forEach((t) => {
            // console.log(t)
            aTerms.add(t);
          });
          others = (others || '').split(';');
          var fmt = '';
          var doc = {src, description, name, fmt, tags, terms, others};
          acc.push(doc);
        }
        return acc;
      }, []);

      asyncReturn({db, tags: Array.from(aTags.values()).sort(), terms: Array.from(aTerms.values()).sort()});

    });
  }

}
