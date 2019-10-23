//helper function for nicely fading groups of trails
var showTrails = (objects) => {
  objects.map(async (object) => {
    let isEnabled = false;
    const returnValue = await openspace.getPropertyValue("Scene." + object + "Trail.Renderable.Enabled");
    if (returnValue) {
      isEnabled = returnValue[1];
    }
    if (!isEnabled) {      
      openspace.setPropertyValue("Scene." + object + "Trail.Renderable.Opacity", 0)
      openspace.setPropertyValue("Scene." + object + "Trail.Renderable.Enabled", true)
    }
    openspace.setPropertyValue("Scene." + object + "Trail.Renderable.Opacity", 1, 1)
  })
}

//helper function to set the focus target
var setFocus = (focus) => {
  openspace.setPropertyValue('NavigationHandler.OrbitalNavigator.Anchor', focus);
  openspace.setPropertyValue('NavigationHandler.OrbitalNavigator.RetargetAnchor', null);
}   
//list of commands to setup apollo 11 site
var setupApollo11Site = () => { 
  openspace.time.setTime('1969 JUL 20 20:17:40');
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_11.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A11_M177481212_p_longlat.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.LodScaleFactor', 20.11);
  openspace.setPropertyValue("NavigationHandler.OrbitalNavigator.Anchor", "Apollo11LemModel");
  openspace.setPropertyValue('NavigationHandler.OrbitalNavigator.RetargetAnchor', null);
  openspace.setPropertyValueSingle('Scene.Apollo11MoonTrail.Renderable.Opacity', 1);
  openspace.setPropertyValueSingle('Scene.Apollo11LemTrail.Renderable.Opacity', 1);
  openspace.setPropertyValueSingle('Scene.Apollo11MoonTrail.Renderable.Enabled', true);
  openspace.setPropertyValueSingle("Scene.Apollo11LemTrail.Renderable.Enabled", true);
};
//list of commands to setup apollo 17 site
var setupApollo17Site = function() { 
  openspace.time.setTime('1972 DEC 12 19:47:11');
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_travmap.BlendMode', 0.000000);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_travmap.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_17.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_LEM.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_LEM.BlendMode', 0.000000);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_NAC_Alt_p.Enabled', true);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_NAC_Alt_p.BlendMode', 0.000000);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.LodScaleFactor', 20.17);
  openspace.setPropertyValue('NavigationHandler.OrbitalNavigator.Anchor', 'Apollo17LemModel');
  openspace.setPropertyValue('NavigationHandler.OrbitalNavigator.RetargetAnchor', null);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A17_station7.BlendMode', 0.000000)
}
//list of commands to disable apollo sites
var disableSites = function() { 
  openspace.setPropertyValue('Scene.Moon.Renderable.Layers.ColorLayers.A17_*.Enabled', false);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_11.Enabled', false);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.ColorLayers.A11_M177481212_p_longlat.Enabled', false);
  openspace.setPropertyValueSingle('Scene.Apollo11MoonTrail.Renderable.Enabled', false);
  openspace.setPropertyValueSingle('Scene.Apollo11LemTrail.Renderable.Enabled', false);
  openspace.setPropertyValueSingle('Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_17.Enabled', false);
}
//now setup all the buttons
var siteButtons = {
  title: "Site Setup",
  buttons: {
    'Setup Apollo 11 site': () => {setupApollo11Site(); },
    'Setup Apollo 17 site': () => {setupApollo17Site(); },
    'Disable all sites': () => { disableSites(); }
  }
};
var focusButtons = {
  title: "Set Focus",
  buttons: {
    'Focus on Moon': () => {setFocus('Moon')},
    'Focus on Apollo 11 Lem': () => {setFocus('Apollo11LemModel')},
    'Focus on Apollo 11 Orbiter': () => {setFocus('Apollo11')},
    'Focus on Apollo 17 Lem': () => {setFocus('Apollo17LemModel')}
  }
};
var trailButtons = {
  title: "Trails",
  buttons: {
    'Moon': () => { showTrails(['Moon']) },
    'Apollo 11 Orbits': () => { showTrails(['Apollo11Moon']) },
    'Apollo 11 Lunar Lander': () => { showTrails(['Apollo11Lem']) },
    'Earth, Moon & Mars': () => { showTrails(['Earth', 'Moon', 'Mars']) },
  }
};

var apolloButtonGroups = [siteButtons, focusButtons, trailButtons];
