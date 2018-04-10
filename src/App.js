import React, { Component } from "react";
import "./App.css";
import speach from "speach";

class Stretch extends Component {
  constructor(props) {
    super(props);
    this.speaker = speach();
    this.speaker.voice("Google UK English Female");

    this.state = {
      stretch: "easy",
      side: "left",
      complete: false
    };
    this.updateStrechStep = this.updateStrechStep.bind(this);
  }

  componentDidMount() {
    this.doStretch();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.content !== prevProps.content) {
      this.setState(
        {
          side: "left",
          stretch: "easy",
          complete: false
        },
        this.doStretch
      );
    }
  }

  startDevelopmentalStretch() {
    this.speaker.speak("Hold a developmental stretch");

    this.timeout = setTimeout(() => {},
    this.props.developmentalStretchSeconds * 1000);
  }

  updateStrechStep() {
    const hasDevelopmentalStretch = this.props.developmentalStretchSeconds;
    const { bothSides } = this.props;
    const { stretch, side } = this.state;
    const newState = {};
    if (stretch === "easy" && hasDevelopmentalStretch) {
      newState.stretch = "developmental";
    } else if (stretch === "easy" && side === "left" && bothSides) {
      newState.stretch = "easy";
      newState.side = "right";
    } else if (stretch === "developmental" && side === "left" && bothSides) {
      newState.stretch = "easy";
      newState.side = "right";
    } else if (
      side === "right" &&
      stretch === "easy" &&
      hasDevelopmentalStretch
    ) {
      newState.stretch = "developmental";
      newState.side = "right";
    } else {
      newState.complete = true;
    }
    this.setState(newState, this.doStretch);
  }

  doStretch() {
    const { content, seconds, developmentalStretchSeconds } = this.props;
    const { complete, side, stretch } = this.state;
    if (complete) {
      this.props.onComplete();
      return;
    }
    let delay = 0;
    let toSay = "";
    if (side === "left" && stretch === "easy") {
      toSay = content;
      // Add three seconds to any stretch to allow for the stretcher
      // to get into position.
      delay = (seconds + 3) * 1000;
    }
    if (side === "left" && stretch === "developmental") {
      toSay = "Hold a developmental stretch";
      delay = developmentalStretchSeconds * 1000;
    }
    if (side === "right" && stretch === "easy") {
      toSay = "Repeat on the right side";
      delay = seconds * 1000;
    }
    if (side === "right" && stretch === "developmental") {
      toSay = "Hold a developmental stretch";
      delay = developmentalStretchSeconds * 1000;
    }
    this.speaker.speak(toSay);
    this.timeout = setTimeout(this.updateStrechStep, delay);
  }

  render() {
    return null;
  }
}

const stretches = [
  {
    content:
      "Sitting Groin Stretch. Sit on the floor. Clasp the soles of your feet together with your hands. Gently lean forward from the hips until you feel an easy stretch in your groin. Contract your abdominal muscles mildly as you go into the stretch.",
    seconds: 15
  },
  {
    content:
      "Hamstring and hip stretch. On the floor, put your left leg out. Bend your right knee and pull the ankle towards you. Hold onto the outside of your leg with the other and forearm around your bent knee.",
    seconds: 15,
    developmentalStretchSeconds: 10,
    bothSides: true
  },
  {
    content:
      "Piriformis stretch. Lie on your back. Bend your right knee and put your right calf on your opposite knee. Gently pull your leg toward your chest.",
    seconds: 15,
    bothSides: true
  },
  {
    content:
      "Piriformis stretch. Lie on your back. Bend your right knee and put your right calf on your opposite knee. Gently pull your leg toward your chest.",
    seconds: 15,
    bothSides: true
  }
];
//
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stretches: stretches,
      stretchIndex: 0
    };
    this.stretchComplete = this.stretchComplete.bind(this);
  }

  stretchComplete() {
    this.setState((prevState, props) => {
      return {
        stretchIndex: prevState.stretchIndex + 1
      };
    });
  }

  render() {
    const { stretches, stretchIndex } = this.state;
    const stretch = stretches[stretchIndex];
    if (!(stretchIndex in stretches)) {
      return null;
    }
    return (
      <Stretch
        content={stretch.content}
        seconds={stretch.seconds}
        developmentalStretchSeconds={stretch.developmentalStretchSeconds}
        bothSides={stretch.bothSides}
        onComplete={this.stretchComplete}
      />
    );
  }
}

export default App;
