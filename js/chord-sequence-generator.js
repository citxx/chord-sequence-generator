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
  this.chordGen = chordSequenceGenerator;
  this.tempo = tempo;

  this.setTempo = function(tempo) {
    this.tempo = tempo;
  };

  this.run = function() {
    var self = this;
    setInterval(function() {
      $('#chords').html(self.chordGen.next().toString());
    }, 4 * 60 * 1000 / self.tempo);
  };
};

var gen = new RandomChordSequence();
var scroller = new ChordScroller(gen, 120);
scroller.run();
