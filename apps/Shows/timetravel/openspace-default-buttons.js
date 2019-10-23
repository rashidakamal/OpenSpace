var TimeButtons = {
  title: "Time Controls",
  buttons: {
    'Toggle Pause (Interpolated)': () => { 
      openspace.time.interpolateTogglePause();
    },
    'Toggle Pause (Immediate)': async () => { 
      openspace.time.togglePause();
    },
    'Realtime': () => { 
      openspace.time.interpolateDeltaTime(1)
    },
    '1 hr/sec': () => { 
      openspace.time.interpolateDeltaTime(3600)
    },    
    '4 hr/sec': () => { 
      openspace.time.interpolateDeltaTime(14400)
    },    
    '12 hr/sec': () => { 
      openspace.time.interpolateDeltaTime(43200)
    },  
    'Travel back in Time': () => { 
      openspace.time.interpolateTimeRelative(-8.640000E+04,1.000000E+00)
    },   
  }
};

var CaptureButtons = {
  title: "Capture Controls",
  buttons: {
    'Start Recording': () => { 
      openspace.sessionRecording.startRecording("test3")
    },
    'Stop Recording': async () => { 
      openspace.sessionRecording.stopRecording()
    },  
    'Playback Recording': async () => { 
      openspace.sessionRecording.startPlayback("test3")
      openspace.sessionRecording.stopRecording()

    },   
  }
};

var VisualButtons = {
  title: "Visual",
  buttons: {
    'Hide All Trails': async () => { 
        const duration = 1;
        openspace.setPropertyValue("Scene.*Trail.Renderable.Opacity", 0, 1)
        setTimeout(() => {
          openspace.setPropertyValue("Scene.*Trail.Renderable.Enabled", false)  
        }, duration * 1000)
    },
    'Show All Trails': async () => { 
        const duration = 1;
        openspace.setPropertyValue("Scene.*Trail.Renderable.Enabled", true)  
        openspace.setPropertyValue("Scene.*Trail.Renderable.Opacity", 1, 1)
    },
  }
};

var FrictionButtons = {
  title: "Camera Friction",
  buttons: {
    'Toggle Rotation friction': async () => { 
      var isEnabled = await openspace.getPropertyValue('NavigationHandler.OrbitalNavigator.Friction.RotationalFriction');
      openspace.setPropertyValueSingle('NavigationHandler.OrbitalNavigator.Friction.RotationalFriction', !isEnabled[1]);
    },
    'Toggle Zoom friction': async () => { 
      var isEnabled = await openspace.getPropertyValue('NavigationHandler.OrbitalNavigator.Friction.ZoomFriction');
      openspace.setPropertyValueSingle('NavigationHandler.OrbitalNavigator.Friction.ZoomFriction', !isEnabled[1]);
    },
    'Toggle Roll friction': async () => { 
      var isEnabled = await openspace.getPropertyValue('NavigationHandler.OrbitalNavigator.Friction.RollFriction');
      openspace.setPropertyValueSingle('NavigationHandler.OrbitalNavigator.Friction.RollFriction', !isEnabled[1]);
    },
  }
};

var SystemButtons = {
  title: "System",
  buttons: {
    'Toggle Dashboard': async () => { 
      var isEnabled = await openspace.getPropertyValue('Dashboard.IsEnabled');
      openspace.setPropertyValueSingle('Dashboard.IsEnabled', !isEnabled[1]);
      openspace.setPropertyValueSingle("RenderEngine.ShowLog", !isEnabled[1]);
      openspace.setPropertyValueSingle("RenderEngine.ShowVersion", !isEnabled[1]);
      openspace.setPropertyValueSingle("RenderEngine.ShowCamera", !isEnabled[1]);
    },
    'Toggle Native GUI': async () => { 
      var isEnabled = await openspace.getPropertyValue('Modules.ImGUI.Main.Enabled');
      openspace.setPropertyValueSingle('Modules.ImGUI.Main.Enabled', !isEnabled[1]);
    },
    'Toggle Main GUI': async () => { 
      var isEnabled = await openspace.getPropertyValue('Modules.CefWebGui.Visible');
      openspace.setPropertyValueSingle('Modules.CefWebGui.Visible', !isEnabled[1]);
    },
    'Take Screenshot': () => { 
      openspace.setPropertyValueSingle('RenderEngine.TakeScreenshot', null)
    },
    '---': () => { 
    },
    '!!!---> Toggle Shutdown <---!!!': () => { 
      openspace.toggleShutdown();
    },
  }
};
var defaultButtonGroups = [TimeButtons, CaptureButtons, VisualButtons];
