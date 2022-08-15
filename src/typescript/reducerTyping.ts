type Video = {
  title: string
}

// type ReducerActionTypes = "setVideos" | "setSelectedVideo"

// interface SetVideosPayload {
//   setVideos: Video[]
// }

// interface SetSelectedVideoPayload {
//   setSelectedVideo: Video
// }

// type State = {
//   selectedVideo: Video | null
//   videos: Video[]
// }

// type SetVideosAction = {
//   type: "setVideos"
//   payload: SetVideosPayload
// }

// type SetSelectedVideoAction = {
//   type: "setSelectedVideos"
//   payload: SetSelectedVideoPayload
// }

// type ReducerAction = SetVideosAction | SetSelectedVideoAction

type ReducerActionTypes = keyof ReducerActionPayloads

interface ReducerActionPayloads {
  readonly setVideos: Video[]
  readonly setSelectedVideo: Video
}

type ReducerAction<A = never> =
  (A extends ReducerActionPayloads ? A : never) & {
    readonly type: A
    readonly payload: ReducerActionPayloads[A]
  }

type State__ = {
  selectedVideo: Video | null
  videos: Video[]
}

const initialState: State__ = {
  selectedVideo: null,
  videos: []
}

const reducer = <A extends ReducerActionTypes>(
  state: State__,
  action: ReducerAction<A>
) => {
  switch (action.type) {
    case "setVideos":
      return { ...state, videos: action.payload }
    default:
      break
  }
}
