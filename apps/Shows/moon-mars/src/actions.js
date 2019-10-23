import images from './images';
import displayEnvironment from './displayEnvironment';

let screenspaceRenderables = [];

export default (openspace) => {

  async function sleep(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  function fullImageUri(identifier) {
    return "screenspace-image-" + identifier;
  }

  async function fadeOut(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    openspace.setPropertyValue("RenderEngine.BlackoutFactor", 0, duration * 0.8);
    await sleep(duration * 1000);
  }

  async function fadeIn(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    openspace.setPropertyValue("RenderEngine.BlackoutFactor", 1, duration * 0.8);
    await sleep(duration * 1000);
  }

  async function kennedySpeechLocation() {
    await fadeOut();
    openspace.time.setDeltaTime(1);
    openspace.time.setPause(true);
    openspace.time.setTime("1962-09-12T18:00:00")

    openspace.navigation.setNavigationState({
      Anchor: "Earth",
      Position: [6.116502E6,-1.992908E7,4.872328E6],
      Up: [0.272363E0,0.306573E0,0.912048E0]
    });
    await fadeIn();
  }

  async function tripToTheMoonTime() {
    openspace.time.setDeltaTime(1);
    openspace.time.setPause(true);
    openspace.time.setTime("1962-09-13T18:00:00")
  }

  async function apollo11LaunchTime() {
    openspace.time.setDeltaTime(1);
    openspace.time.setPause(true);
    openspace.time.setTime("1969-07-16T13:32:00")
  }

  function fullMoon() {
    openspace.time.setTime("2018-09-24 13:00:00");
    openspace.navigation.setNavigationState({
      Anchor: "Moon",
      Position: [4.245410E6,-8.237393E5,5.265029E5],
      ReferenceFrame: "Earth",
      Up: [0, 0, 1]
    });
  }

  function getClose() {
    openspace.setPropertyValue("NavigationHandler.OrbitalNavigator.StereoscopicDepthOfFocusSurface", 1.5, 1);
  }

  function stepAway() {
    openspace.setPropertyValue("NavigationHandler.OrbitalNavigator.StereoscopicDepthOfFocusSurface", 8, 1);
  }

  async function addImage(identifier) {
    const imageData = images[identifier];

    if (!imageData) {
      console.error("Missing image data for " + identifier);
      return;
    }

    const url = imageData.url;
    const uri = fullImageUri(identifier);
    let position = undefined;
    
    if (displayEnvironment.isDome()) {
      position = imageData.domePosition || imageData.flatPosition || [3, 0, 0];
    } else {
      position = imageData.flatPosition || imageData.domePosition || [3, 0, 0];
    }

    const tweenPosition = imageData.tweenPosition;

    const tweenDistance = displayEnvironment.isDome() ? 10 : 3;

    const initialPosition = tweenPosition ? [position[0] + tweenDistance, position[1], position[2]] : position;

    const spec = {
        Type: "ScreenSpaceImageOnline",
        Identifier: uri,
        Name: identifier,
        URL: url,
        Enabled: true,
        UseRadiusAzimuthElevation: true,
        FaceCamera: displayEnvironment.isDome(),
        RadiusAzimuthElevation: initialPosition,
        UsePerspectiveProjection: true,
        Alpha: 0,
        Scale: imageData.scale || 1
    };

    // If image is already added, this will throw an error, but that's fine for the moment.
    openspace.addScreenSpaceRenderable(spec);
    screenspaceRenderables.push(uri);

    // Enable the image if it already existed but was invisible.
    openspace.setPropertyValue("ScreenSpace." + uri + ".Alpha", 0);
    openspace.setPropertyValue("ScreenSpace." + uri + ".Enabled", true);  
    openspace.setPropertyValue("ScreenSpace." + uri + ".RadiusAzimuthElevation", initialPosition);
    openspace.setPropertyValue("ScreenSpace." + uri + ".Rotation", imageData.rotation || [0, 0, 0]);


    await sleep(500);
    openspace.setPropertyValueSingle("ScreenSpace." + uri + ".RadiusAzimuthElevation", position, 1, 'CubicEaseOut');
    openspace.setPropertyValue("ScreenSpace." + uri + ".Alpha", 1, 1);
  }


  async function removeImage(identifier) {
    const uri = fullImageUri(identifier);
    openspace.setPropertyValue("ScreenSpace." + uri + ".Alpha", 0, 1);
    await sleep(2000);
    openspace.setPropertyValue("ScreenSpace." + uri + ".Enabled", false);
    // Ideally, we want to:
    // openspace.removeScreenSpaceRenderable(uri);
    // However, there is an issue with interpolations and removing property owners.

  }

  function clearImages() {
    screenspaceRenderables.forEach(ssr => {
      openspace.removeScreenSpaceRenderable(ssr);
    })
    screenspaceRenderables = [];
  }


  async function showInsignias() {
    const tween = 0.5;
    const gap = 1 * 1000;
    
    openspace.setPropertyValue("Scene.Apollo" + 11 + "Insignia.Renderable.Opacity", 1, tween)
    await sleep(gap);
    openspace.setPropertyValue("Scene.Apollo" + 12 + "Insignia.Renderable.Opacity", 1, tween)
    await sleep(gap);
    openspace.setPropertyValue("Scene.Apollo" + 14 + "Insignia.Renderable.Opacity", 1, tween)
    await sleep(gap);
    openspace.setPropertyValue("Scene.Apollo" + 15 + "Insignia.Renderable.Opacity", 1, tween)
    await sleep(gap);
    openspace.setPropertyValue("Scene.Apollo" + 16 + "Insignia.Renderable.Opacity", 1, tween)
    await sleep(gap);
    openspace.setPropertyValue("Scene.Apollo" + 17 + "Insignia.Renderable.Opacity", 1, tween)
  }

  function hideInsignias() {
    const tween = 0.5;
    openspace.setPropertyValue("Scene.Apollo*Insignia.Renderable.Opacity", 0, tween)
  }

  function jumpToPreEarthrise() {
    openspace.time.setDeltaTime(1);
    openspace.time.setPause(true);
    openspace.time.setTime("1968 DEC 24 16:37:31");

    openspace.navigation.setNavigationState({
      Anchor: "Apollo8",
      Position: [1.494592E1, 3.236777E1, -4.171296E1],
      ReferenceFrame: "Root",
      Up: [0.960608E0, -0.212013E0, 0.179675E0]
    });
  }

  function useAdaptiveStereoscopicDepth() {
    openspace.setPropertyValue("NavigationHandler.OrbitalNavigator.UseAdaptiveStereoscopicDepth", true);
  }

  async function showTrails(objects, duration) {
    if (duration === undefined) {
      duration = 1;
    }
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
      openspace.setPropertyValue("Scene." + object + "Trail.Renderable.Opacity", 1, duration)
    })
    await sleep(duration * 1000);
  }

  async function hideAllTrails(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    openspace.setPropertyValue("Scene.*Trail.Renderable.Opacity", 0, duration)
    await sleep(duration * 1000);
    openspace.setPropertyValue("Scene.*Trail.Renderable.Enabled", false)  
  }

  function playRealtimeVideo(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    openspace.time.setDeltaTime(1);
    openspace.time.setPause(false);
    openspace.setPropertyValue("ScreenSpace.ApolloVideos.Alpha", 0)
    openspace.setPropertyValue("ScreenSpace.ApolloVideos.Enabled", true)
    openspace.setPropertyValue("ScreenSpace.ApolloVideos.Alpha", 1, duration)
  }

  function apolloVideoToSide(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    
    if (displayEnvironment.isDome()) {
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.FaceCamera", true);
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.RadiusAzimuthElevation", [3, 0.5, 0.5], duration)
    } else {
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.FaceCamera", false);
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.RadiusAzimuthElevation", [4, 0.5, 0], duration)
    }
  }

  function apolloVideoToCenter(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    if (displayEnvironment.isDome()) {
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.FaceCamera", true);
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.RadiusAzimuthElevation", [3, 0, 0.5], duration)
    } else {
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.FaceCamera", false);
      openspace.setPropertyValue("ScreenSpace.ApolloVideos.RadiusAzimuthElevation", [2, 0, 0], duration)
    }
  }

  async function hideRealtimeVideo(duration) {
    if (duration === undefined) {
      duration = 1;
    }
    openspace.setPropertyValue("ScreenSpace.ApolloVideos.Alpha", 0, duration)
    await sleep(duration * 1000);
    openspace.setPropertyValue("ScreenSpace.ApolloVideos.Enabled", false)
  }

  async function fadeLayer(layer, enable) {
    if (enable) {
      openspace.setPropertyValueSingle(layer + ".Enabled", true);
    }
    openspace.setPropertyValueSingle(layer + ".Settings.Opacity", enable ? 1 : 0, 1);
    await sleep(1000);

    if (!enable) {
      openspace.setPropertyValueSingle(layer + ".Settings.Enabled", false);
    }
  }

  function enableApollo11Layers(enabled) {
    fadeLayer('Scene.Moon.Renderable.Layers.ColorLayers.LRO_NAC_Apollo_11', enabled)
    openspace.setPropertyValueSingle("Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_11.Enabled", enabled);
  }


  function enableApollo17Lro(enabled) {
    fadeLayer('Scene.Moon.Renderable.Layers.ColorLayers.LRO_NAC_Apollo_17', enabled)
    openspace.setPropertyValueSingle("Scene.Moon.Renderable.Layers.HeightLayers.LRO_NAC_Apollo_17.Enabled", enabled);
  }

  function enableApollo17Travmap(enabled) {
    if (enabled) {
      openspace.setPropertyValueSingle("Scene.Moon.Renderable.Layers.ColorLayers.A17_travmap.BlendMode", 0.0);
    }
    fadeLayer('Scene.Moon.Renderable.Layers.ColorLayers.A17_travmap', enabled)
  }

  return [
    {
      title: "About this show",
      description: "To use this show, open the scene 'apollo8' in OpenSpace.",
    },
    {
      title: "Trails",
      description: "Showing and hiding trails",
      buttons: {
        'Moon': () => { showTrails(['Moon']) },
        'Apollo 8 Launch': () => { showTrails(['Apollo8Launch']) },
        'Apollo 8 Moon': () => { showTrails(['Apollo8Moon']) },
        'Apollo 8 Full': () => { showTrails(['Apollo8EarthBarycenter']) },
        'Earth, Moon & Mars': () => { showTrails(['Earth', 'Moon', 'Mars']) },
        'Hide All': () => { hideAllTrails(); },
      }
    },
    {
      title: "Sputnik Intro",
      description: "Show a picture of Sputnik in the top of the dome",
      buttons: {
        Show: () => { addImage('sputnik'); },
        Hide: () => { removeImage('sputnik'); }
      }
    },
    {
      title: "Dreaming about flying",
      description: "Pictures in front of dome",
      buttons: {
        'Man in the moone': () => { addImage('manInTheMoone'); },
        'Jules Verne': async () => { addImage('julesVerne1'); await sleep(1000); addImage('julesVerne2') },
        'Goddard': () => { addImage('goddard'); },
        'Hide': () => {
          removeImage('manInTheMoone');
          removeImage('julesVerne1');
          removeImage('julesVerne2');
          removeImage('goddard');
        }
      }
    },
    {
      title: "Early Soviet Missions",
      description: "Pictures in front of dome",
      buttons: {
        'Laika': () => { addImage('laika'); },
        'Luna 2': () => { addImage('luna2'); },
        'Luna 3': () => { addImage('luna3'); },
        'Hide': () => {
          removeImage('laika');
          removeImage('luna2');
          removeImage('luna3');
        }
      }
    },
    {
      title: "Later Soviet Missions",
      description: "Pictures in front of dome",
      buttons: {
        'Gagarin': () => { addImage('gagarin'); },
        'Vostok': () => { addImage('vostokSpacecraft'); },
        'News': () => { addImage('sovietNews'); },
        'Teresjkova': () => { addImage('teresjkovaMedals'); addImage('teresjkovaMedals'); },
        'Hide': () => {
          removeImage('gagarin');
          removeImage('vostokSpacecraft');
          removeImage('sovietNews');
          removeImage('teresjkovaMedals');
        }
      }
    },
    {
      title: "Early US Missions",
      description: "Pictures in front of dome",
      buttons: {
        'Explorer': () => { addImage('explorer'); },
        'Shephard': () => { addImage('shepard'); },
        'Glenn': () => { addImage('glenn'); },
        'Hide': () => {
          removeImage('explorer');
          removeImage('shepard');
          removeImage('glenn');
        }
      }
    },
    {
      title: "Kennedy Speech & Trip to the moon",
      buttons: {
        'Jump to Washington DC': () => { kennedySpeechLocation(); apolloVideoToCenter(0); } ,
        'Trip to the moon': () => { tripToTheMoonTime(); } ,
        'Start video': () => { playRealtimeVideo() },
        'Hide video': () => { hideRealtimeVideo() },
      }
    },
    {
      title: "Apollo 8 Launch",
      buttons: {
        'Jump to launch time': async () => { await fadeOut(); hideAllTrails(0); await sleep(100); openspace.time.setTime("1968-12-21T12:51:51.0"); showTrails(['Apollo8Launch']); fadeIn(); },
        'Show Insignia': () => { addImage('apollo8Insignia'); },
        'Hide Insignia': () => { removeImage('apollo8Insignia'); },
        'Launch trail': async () => { await hideAllTrails(); await showTrails(['Apollo8Launch']); },
        'Translunar trail': async () => { await hideAllTrails(); await showTrails(['Moon']); showTrails(['Apollo8EarthBarycenter']) },
      }
    },
    {
      title: "Earthrise",
      description: "Earthrise starts at 1968 DEC 24 16:37:31 UTC",

      buttons: {
        'Jump to Pre-Earthrise': async () => { await fadeOut(); hideAllTrails(0); jumpToPreEarthrise(); fadeIn(); },
        'Play realtime': () => { playRealtimeVideo(); },
        //'Interior': () => { jumpInsideApollo8() },
        //'Exterior': () => { jumpOutOfApollo8() },
        'Show real photo': () => { addImage('earthrise'); },
        'Hide real photo': () => { removeImage('earthrise'); },
        //'Enable Adaptive Stero': () => { useAdaptiveStereoscopicDepth() },
      }
    },
    {
      title: "Apollo 11 Launch",
      buttons: {
        'Show Insignia': () => { addImage('apollo11Insignia'); },
        'Hide Insignia': () => { removeImage('apollo11Insignia'); },

        'Jump to launch time': () => { apollo11LaunchTime(); apolloVideoToCenter(0); },
        'Start launch': () => { playRealtimeVideo() },
        'Hide video': () => { hideRealtimeVideo() },
      }
    },
    {
      title: "Apollo 11 Landing",
      description: "Make sure to focus on Apollo Lunar Lander Position first.",
      buttons: {
        'Focus on Moon': () => { openspace.setPropertyValueSingle('NavigationHandler.OrbitalNavigator.Anchor', 'Moon') },
        'Hide all trails': () => { hideAllTrails(); },
        'Landing time': () => { apolloVideoToSide(0); openspace.time.setTime('1969-07-20T20:14:40'); openspace.time.setDeltaTime(1.0); openspace.time.setPause(true); },
        'Show CSM trail': () => { showTrails(['Apollo11Moon']); },
        'Show LEM trail': () => { showTrails(['Apollo11Lem']); },
        'Focus on LEM': () => { openspace.setPropertyValueSingle('NavigationHandler.OrbitalNavigator.Anchor', 'Apollo11LemPosition') },
        'Start landing': () => { playRealtimeVideo(); },
        'Hide video': () => { hideRealtimeVideo() },
        'Globe Browsing Layers On': () => { enableApollo11Layers(true); },
        'Layers Off': () => { enableApollo11Layers(false); },
      }
    },
    {
      title: "Apollo 11 Pictures",
      buttons: {
        'Armstrong': () => { addImage('armstrongLadder'); },
        'Aldrin': () => { addImage('aldrinLadder'); },
        'Footprints': () => { addImage('apollo11Footprints'); },
        'More Footprints': () => { addImage('apollo11MoreFootprints'); },
        'Nixon': () => { addImage('nixon'); },
        'News': async () => { addImage('apollo11News1'); await sleep(1000); addImage('apollo11News2'); },
        'Hide Pictures': () => {
          removeImage('armstrongLadder');
          removeImage('aldrinLadder');
          removeImage('apollo11Footprints');
          removeImage('apollo11MoreFootprints');
          removeImage('nixon');
          removeImage('apollo11News1');
          removeImage('apollo11News2');
        },
      }
    },
    {
      title: "Apollo 13",
      buttons: {
        'We\'ve had a problem': async () => {
          addImage('apollo13Problem');
          await sleep(500);
         },
        'Hide': () => {
          removeImage('apollo13Problem');
        },
      }
    },
    {
      title: "Landing on Earth",
      buttons: {
        'Show Landing Pictures': async () => {
          addImage('apollo13Landing');
          await sleep(500);
          addImage('apollo13InWater');
          await sleep(500);
          addImage('apollo13Helicopter');
          await sleep(500);
          addImage('apollo13LoadOnDeck');
         },
        'Hide': () => {
          removeImage('apollo13Landing');
          removeImage('apollo13InWater');
          removeImage('apollo13Helicopter')
          removeImage('apollo13LoadOnDeck');
        },
      }
    },
    {
      title: "Apollo Landing Sites - Overview",
      buttons: {
        'Full Moon September 2018': async () => { hideAllTrails(); await fadeOut(); fullMoon(); fadeIn(); },
        'Show Insignias': () => { showInsignias() },
        'Hide Insignias': () => { hideInsignias() },
      }
    },
    {
      title: "Apollo 17",
      description: "Globe Browsing layers",
      buttons: {
        'LRO On': () => { enableApollo17Lro(true); },
        'LRO Off': () => { enableApollo17Lro(false); },
        'Travmap On': () => { enableApollo17Travmap(true); },
        'Travmap Off': () => { enableApollo17Travmap(false); } 
      }
    },
    {
      title: "Apollo 17 Pictures",
      buttons: {
        'LRV': async () => {
          addImage('apollo17Lrv');
         },
         'Digging': async () => {
          addImage('apollo17Digging');
         },
         'Reflector': async () => {
          addImage('apollo17Reflector');
         },
         'Boulder': async () => {
          addImage('apollo17Boulder');
         },
        'Hide': () => {
          removeImage('apollo17Lrv');
          removeImage('apollo17Digging');
          removeImage('apollo17Reflector');
          removeImage('apollo17Boulder');
        },
      }
    },
    {
      title: "Utilities",
      buttons: {
        'Clear all images (fragile)': () => { clearImages() },
        'Stereo 3D: Get Close': () => { getClose(); },
        'Stereo 3D: Step Away': () => { stepAway(); }
      }
    }
  ];
} 