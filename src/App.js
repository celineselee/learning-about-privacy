import './App.scss';
import React from 'react';
import story from './copy.json'

class WelcomePage extends React.Component {
  render() {
    return (
      <div>
        <p>welcome!</p>
        <button className='navigation-action' onClick={() => this.props.startStory()}>Start</button>
      </div>
    );
  }
}

class StoryPage extends React.Component {
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
        <h2>{this.props.options[this.props.userChoice].optionText}</h2>

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
                return(<p key={index}>{rec}</p>)
              })
            }
          </div>
        </div>

         {this.renderPagination()}

        <button className='navigation-action' onClick={() => this.props.nextRiskPage()}> 
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
        return <RisksPage
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
