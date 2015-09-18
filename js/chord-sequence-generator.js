"use strict";

teoria.note.random = function() {
  var noteNames = ["Ab", "A", "Bb", "B", "C", "Db", "D", "Eb", "E", "F", "F#", "G"];
  var noteIndex = Math.floor(Math.random() * noteNames.length);
  return teoria.note(noteNames[noteIndex]);
};

teoria.chord.random = function() {
  var baseNote = teoria.note.random();
  var chordTypes = ["m7", "7", "maj7"];
  var chordType = chordTypes[Math.floor(Math.random() * chordTypes.length)];
  return teoria.chord(baseNote, chordType);
};

var RandomChordSequence = function() {
  this.fifthTransitions = true;
  this.parallelTonalityTransitions = false;
  this.oppositeTonalityTransitions = false;
  this.currentChord = undefined;
  this.nextChord = teoria.chord.random();

  this.setFifthTransitions = function(fifthTransitions) {
    this.fifthTransitions = fifthTransitions;
  };

  this.setParallelTonalityTransitions = function(parallelTonality) {
    this.parallelTonality = parallelTonality;
  };

  this.setOppositeTonalityTransitions = function(oppositeTonality) {
    this.oppositeTonality = oppositeTonality;
  };

  this.setCallback = function(callback) {
    this.callback = callback;
  };

  var chordTypes = ["m7", "7", "maj7"];

  this.next = function() {
    this.currentChord = this.nextChord;

    var candidates = [];

    candidates.push(teoria.chord.random());

    if (this.fifthTransitions) {
      var baseNotes = [
        this.currentChord.root.interval(teoria.interval('P5')),
        this.currentChord.root.interval(teoria.interval('P-5'))
      ];
      for (let i = 0; i < baseNotes.length; ++i) {
        for (let j = 0; j < chordTypes.length; ++j) {
          candidates.push(teoria.chord(baseNotes[i], chordTypes[j]));
        }
      }
    }

    if (this.parallelTonalityTransitions) {
      if (this.currentChord.chord === "m7") {
        let baseNote = this.currentChord.root.iterval(teoria.interval('m3'));
        candidates.push(teoria.chord(baseNote, "maj7"));
      }
      if (this.currentChord.chord === "maj7") {
        let baseNote = this.currentChord.root.iterval(teoria.interval('m-3'));
        candidates.push(teoria.chord(baseNote, "m7"));
      }
    }

    if (this.oppositeTonalityTransitions) {
      if (this.currentChord.chord === "m7") {
        let baseNote = this.currentChord.root.iterval(teoria.interval('M-3'));
        candidates.push(teoria.chord(baseNote, "maj7"));
      }
      if (this.currentChord.chord === "maj7") {
        let baseNote = this.currentChord.root.iterval(teoria.interval('M3'));
        candidates.push(teoria.chord(baseNote, "m7"));
      }
    }

    let nextChordIndex = Math.floor(Math.random() * candidates.length);
    this.nextChord = candidates[nextChordIndex];
    return this.currentChord;
  };
};

var ChordScroller = function(chordSequenceGenerator, tempo) {
  self = this;

  this.chordGen = chordSequenceGenerator;
  this.tempo = tempo;

  this.setTempo = function(tempo) {
    this.tempo = tempo;
  };

  this.getNextChordLine = function() {
    var chordsLine = [];
    for (let i = 0; i < 4; ++i) {
      chordsLine.push(this.chordGen.next().toString());
    }
    return chordsLine;
  };

  this.makeChordLineHtml = function(line) {
    var html = $('<div>').addClass('chord-line');
    for (let i = 0; i < line.length; ++i) {
      $('<div>').addClass('chord').html(line[i]).appendTo(html);
    }
    return html;
  };

  function update() {
      if (self.beatNumber % 4 == 0) {
        Metronome.barClick();
      } else {
        Metronome.click();
      }
    
      if (self.beatNumber > 0 && self.beatNumber % 16 == 0) {
        self.linesHtml[0].remove();

        self.lines.splice(0, 1);
        self.linesHtml.splice(0, 1);

        var newLine = self.getNextChordLine();
        var newLineHtml = self.makeChordLineHtml(newLine);

        self.lines.push(newLine);
        self.linesHtml.push(newLineHtml);

        for (let i = 0; i < self.linesHtml.length; ++i) {
          self.linesHtml[i].removeClass("chord-line-" + (i + 1)).addClass("chord-line-" + i);
        }

        $('#chords').append(newLineHtml);
      }

      if (self.beatNumber % 4 == 0) {
        self.previousChordHtml = self.currentChordHtml;
        let chordNumber = Math.round(self.beatNumber / 4) % 4;
        self.currentChordHtml = $(self.linesHtml[1].children()[chordNumber]);
        console.log(self.currentChordHtml);

        if (typeof self.previousChordHtml !== 'undefined') {
          self.previousChordHtml.removeClass('current-chord').addClass('played-chord');
        }

        self.currentChordHtml.addClass('current-chord');
      }

      self.beatNumber += 1;
  };

  this.run = function() {
    $('#chords').empty();

    self.lines = [["", "", "", ""]];
    for (let i = 0; i < 3; ++i) {
      self.lines.push(self.getNextChordLine());
    }

    self.linesHtml = [];
    for (let i = 0; i < this.lines.length; ++i) {
      let lineHtml = self.makeChordLineHtml(this.lines[i]).addClass("chord-line-" + i);
      self.linesHtml.push(lineHtml);
      $('#chords').append(lineHtml);
    }

    this.beatNumber = 0;
    this.currentChordHtml = undefined;
    self.timer = setInterval(update, 60 * 1000 / this.tempo);
  };

  this.stop = function() {
    clearInterval(this.timer);
  };
};

var Metronome = new (function() {
  this.barClick = function() {
    document.getElementById('click-1').play();
  };

  this.click = function() {
    document.getElementById('click-2').play();
  };

})();



var running = false;
var scroller = undefined;

$('#play-pause').click(function () {
  var button = $('#play-pause');

  if (running) {
    button.html('Play!');

    scroller.stop();
    scroller = undefined;
  } else {
    button.html('Stop');

    var gen = new RandomChordSequence();
    gen.setFifthTransitions($('#fifths-circle-input').is(':checked'));
    gen.setParallelTonalityTransitions($('#parallel-input').is(':checked'));
    gen.setOppositeTonalityTransitions($('#contra-parallel-input').is(':checked'));
    
    scroller = new ChordScroller(gen, 120);
    scroller.setTempo(parseInt($('#tempo-input').val()));

    scroller.run();
  }

  running = !running;
});
