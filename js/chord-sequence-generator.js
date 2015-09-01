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

  this.next = function() {
    this.currentChord = this.nextChord;
    this.nextChord = teoria.chord.random();
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

  this.currentChordLine = this.getNextChordLine();
  this.nextChordLine = this.getNextChordLine();

  this.makeChordLineHtml = function(line) {
    var html = $('<div>').addClass('chord-line');
    for (let i = 0; i < line.length; ++i) {
      $('<div>').addClass('chord').html(line[i]).appendTo(html);
    }
    return html;
  };

  function update() {
      self.currentChordLine = self.nextChordLine;
      self.nextChordLine = self.getNextChordLine();

      $('#chords').empty().append(
        self.makeChordLineHtml(self.currentChordLine)
      ).append(
        self.makeChordLineHtml(self.nextChordLine)
      );
  };

  this.run = function() {
    update();
    setInterval(update, 4 * 4 * 60 * 1000 / this.tempo);
  };
};

var gen = new RandomChordSequence();
var scroller = new ChordScroller(gen, 120);
scroller.run();
