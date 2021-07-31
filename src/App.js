import './App.scss';
import React from 'react';
import story from './copy.json'
import logo from './assets/lock-mascot.png'

class WelcomePage extends React.Component {
  render() {
    return (
      <div className='welcome-page'>
        <div>
          <h1>Welcome to the Privacy Simulator!</h1>
          <p>
            Today, we’ll be spending the day together as you interact with different websites, gadgets and other tech products through a choose-your-adventure type story.
          </p>
          <p>
            For each activity, you can choose how you'd like to interact with tech. At the end, you’ll see a summary of potential privacy risks you are exposing yourself to by using these products, and learn how to better protect yourself online.
          </p>
          <button className='navigation-action' onClick={() => this.props.startStory()}>Start</button>
        </div>
        <img src={logo} alt="Lock mascot"/>
      </div>
    );
  }
}

class StoryPage extends React.Component {
  renderPagination() {
    let pagination = [...Array(this.props.numStoryPages)].map((e, i) => <Pagination key={i} isActive={false}/>)
    pagination[this.props.currStoryPage] = <Pagination key={this.props.currStoryPage} isActive={true}/>
    return (
      <div className='pagination'>{pagination}</div>
    )
  }

  render() {
    return (
      <div className='story-page'>
        <div className='story-paragraphs'>
          {
            this.props.story.map((paragraph, index) => {
              return <p key={index}>{paragraph}</p>
            })
          }
        </div>
        <div className='buttons'>
          <button className='choice-btn' onClick={() => this.props.nextStoryPage(0)}>{this.props.buttonOptions[0].optionText}</button>
          <button className='choice-btn' onClick={() => this.props.nextStoryPage(1)}>{this.props.buttonOptions[1].optionText}</button>
        </div>
        
        {this.renderPagination()}

      </div>
    );
  }
}

class Pagination extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.isActive ? <div className='active'></div> : <div className='inactive'></div>}
      </React.Fragment>
    )
  }
}

class RisksPage extends React.Component {
  renderPagination() {
    let pagination = [...Array(this.props.numRiskPages)].map((e, i) => <Pagination key={i} isActive={false}/>)
    pagination[this.props.currRiskPage] = <Pagination key={this.props.currRiskPage} isActive={true}/>
    return (
      <div className='pagination'>{pagination}</div>
    )
  }

  render() {
    return (
      <div className='risks-page'> 
        <h1>{this.props.topic}</h1>
        <h2>
          {
            this.props.options[this.props.userChoice].hasOwnProperty("displayText") ? this.props.options[this.props.userChoice].displayText : this.props.options[this.props.userChoice].optionText
          }
        </h2>

        <div className='info-boxes'>
          <div className='info-box'>
            <h3>What you should know:</h3>
            {
              this.props.options[this.props.userChoice].risks.map((risk, index) => {
                return(<p key={index} dangerouslySetInnerHTML={{__html: risk}}></p>)
              })
            }
          </div>
          <div className='info-box'>
            <h3>Safeguards & recommendations:</h3>
            {
              this.props.options[this.props.userChoice].recs.map((rec, index) => {
                return(<p key={index} dangerouslySetInnerHTML={{__html: rec}}></p>)
              })
            }
          </div>
        </div>

         {this.renderPagination()}

        <button className='navigation-action' onClick={() => this.props.nextRiskPage()}> 
            Next
        </button>

      </div>
    )
  }
}

class EndPage extends React.Component {
  render() {
    return (
      <div className='end-page'>
        <h2>We hope that this was a good starting point in helping you learn more about privacy!</h2>
        <p>
          Though it is unrealistic to be able to keep yourself 100% safe while being online and using digital products, we hope that you can use what you learned today to be safer online.
        </p>
        <button className='navigation-action' onClick={() => this.props.restart()}> 
          Restart
        </button>

      </div>
    );
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
    this.restart = this.restart.bind(this);
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
      this.changeStoryMode("ending");
      // this.restart()
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
        return <RisksPage
                userChoice={this.state.userChoices[this.state.currRiskPage]}
                options={story[this.state.currRiskPage].options}
                topic={story[this.state.currRiskPage].topic}
                nextRiskPage={this.nextRiskPage}
                numRiskPages={this.state.totalStoryPages}
                currRiskPage={this.state.currRiskPage}
               />
      case "ending":
        return <EndPage 
                  restart={this.restart}
              />
      default:
        return <StoryPage 
                numStoryPages={this.state.totalStoryPages}
                currStoryPage={this.state.currStoryPage}
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
