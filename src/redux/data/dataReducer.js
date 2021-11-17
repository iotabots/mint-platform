const initialState = {
  loading: false,
  name: "",
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
  nfts: []
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        paused: false,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        name: action.payload.name,
        paused: action.payload.paused,
        totalSupply: action.payload.totalSupply,
        cost: action.payload.cost,
        error: false,
        errorMsg: "",
        nfts: action.payload.nfts
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        paused: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
