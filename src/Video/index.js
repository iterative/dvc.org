import React from 'react'
import YouTube from 'react-youtube'
import styled from 'styled-components'

const opts = {
	height: '100%',
	width: '100%',
	playerVars: {
		// https://developers.google.com/youtube/player_parameters
		autoplay: 0,
		showinfo: 0
	}
}

export default ({ id }) => (
	<Wrapper>
		<Video>
			<YouTube videoId={id} opts={opts} />
		</Video>
	</Wrapper>
)

const Wrapper = styled.div`
	width: 100%;
	height: 100%;
`

const Video = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  
  width: 476px;
  height: 273px;

  @media (max-width: 768px) {
    width: 313px;
    height: 320px;
  }
`