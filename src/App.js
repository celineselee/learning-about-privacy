import logo from './logo.svg';
import './App.css';
import React from 'react';
import story from './copy.json'
import { render } from '@testing-library/react';

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>welcome!</p>
        <button onClick={() => this.props.startStory()}>start</button>
      </div>
    );
  }
}

class StoryPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div dangerouslySetInnerHTML={{__html:this.props.story}}></div>
        <button onClick={() => this.props.nextStoryPage(0)}>{this.props.buttonOptions[0].optionText}</button>
        <button onClick={() => this.props.nextStoryPage(1)}>{this.props.buttonOptions[1].optionText}</button>

      </div>
    );
  }
}

class Pagination extends React.Component {
  render() {
    return (
      <div>
        {this.props.isActive ? <div>*</div> : <div>o</div>}
      </div>
    )
  }
}

class ConsequencesPage extends React.Component {
  constructor(props) {
    super(props);
  }

  renderPagination() {
    let pagination = Array(this.props.numRiskPages).fill(<Pagination isActive={false}/>)
    pagination[this.props.currRiskPage] = <Pagination isActive={true}/>
    return (
      <div>{pagination}</div>
    )
  }

  render() {
    return (
      <div>
        <h1>{this.props.topic}</h1>
        <div>
          <h2>What you should know:</h2>
          <p>{this.props.options[this.props.userChoice].risks}</p>
        </div>
        <div>
          <h2>Safeguards & recommendations</h2>
          <p>{this.props.options[this.props.userChoice].recs}</p>
        </div>

        {this.renderPagination()}

        <button onClick={() => this.props.nextRiskPage()}> 
          {this.props.currRiskPage === (this.props.numRiskPages - 1) ? 'Restart' : 'Next' }
        </button>

      </div>
    )
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currStoryPage: 0,
      currRiskPage: 0,
      userChoices: [],
      mode: "welcome",
      totalStoryPages: story.length
    };
    this.startStory = this.startStory.bind(this);
    this.nextStoryPage = this.nextStoryPage.bind(this);
    this.nextRiskPage = this.nextRiskPage.bind(this);
  }

  restart() {
    this.setState({
      currStoryPage: 0,
      currRiskPage: 0,
      userChoices: [],
      mode: "welcome",
      totalStoryPages: story.length
    })
  }

  changeStoryMode(mode) {
    this.setState({mode: mode});
  }

  startStory() {
    this.changeStoryMode("story");
  }

  nextStoryPage(userChoice) {
    this.setState( prevState => {
      return {
        userChoices: prevState.userChoices.concat([userChoice])
      }
    }, () => {
      if(this.state.userChoices.length === story.length){
        this.changeStoryMode("consequences");
        return;
      }
      else {
        this.setState(prevState => {
          return {
            currStoryPage: prevState.currStoryPage += 1
          }
        }) 
      }
    })  
  }

  nextRiskPage() {
    if(this.state.currRiskPage === story.length - 1) {
      this.restart()
    }
    else {
      this.setState(prevState => {
        return {
          currRiskPage: prevState.currRiskPage += 1
        }
      })  
    }
  }

  renderStory() {
    switch(this.state.mode) {
      case "welcome":
        return <WelcomePage startStory={this.startStory}/>
      case "consequences":
        console.log("render consequences page");
        return <ConsequencesPage
                userChoice={this.state.userChoices[this.state.currRiskPage]}
                options={story[this.state.currRiskPage].options}
                topic={story[this.state.currRiskPage].topic}
                nextRiskPage={this.nextRiskPage}
                numRiskPages={this.state.totalStoryPages}
                currRiskPage={this.state.currRiskPage}
               />
      default:
        return <StoryPage 
                story={story[this.state.currStoryPage].story}
                buttonOptions={story[this.state.currStoryPage].options}
                nextStoryPage={this.nextStoryPage}
               />
    }
  }

  render() {
    return (
      <div className="App">
        {this.renderStory()}
      </div>

    );
  }

}

export default App;
