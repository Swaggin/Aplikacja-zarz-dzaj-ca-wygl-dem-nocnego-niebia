export const state = () => ({
  cloudinessLevel: 0,
  moonPhase: 0,
  precipitationType: 'none',
  fogLevel: 0,
});

export const getters = {
  skyData(state) {
    return {
      cloudinessLevel: state.cloudinessLevel,
      moonPhase: state.moonPhase,
      precipitationType: state.precipitationType,
      fogLevel: state.fogLevel,
    }
  }
}

export const mutations = {
  SET_SKY(state, sky) {
    state.precipitationType = sky.precipitationType;
    state.cloudinessLevel   = sky.cloudinessLevel;
    state.moonPhase         = sky.moonPhase;
    state.fogLevel          = sky.fogLevel;
  }
};
