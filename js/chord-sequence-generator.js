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

var ChordSequenceGenerator = function() {
  this.tempo = 120;
  this.fifthTransitions = true;
  this.parallelTonalityTransitions = false;
  this.oppositeTonalityTransitions = false;
  this.callback = undefined;
  this.currentChord = undefined;
  this.nextChord = teoria.chord.random();

  this.setTempo = function(tempo) {
    this.tempo = tempo;
  };

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

  this.run = function() {
  };
};

console.log(.toString());
