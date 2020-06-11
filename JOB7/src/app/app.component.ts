import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { DatabaseProvider } from '../providers/database/database';

import { timer } from 'rxjs/observable/timer';

declare var FCMPlugin; 

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  showSplash = true; // <-- show animation

  constructor(private platform: Platform, private statusBar: StatusBar,
     splashScreen: SplashScreen,
     private databaseProvider: DatabaseProvider) {
       this.databaseProvider.createDatabase();
       this.initialieApp();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      FCMPlugin.onTokenRefresh(function (token) {      
        //alert(token);    
      });       
      FCMPlugin.getToken(function (token) {      
        //alert(token);    
      });   
      FCMPlugin.subscribeToTopic('promosi'); 
      FCMPlugin.onNotification(function (data) {       
        if (data.wasTapped) {          
          //Notification was received on device tray and tapped by the user.          
          alert(JSON.stringify(data));       
        } else {          
          //Notification was received in foreground. Maybe the user needs to be notified.          
          alert(JSON.stringify(data));       
        }     
      });
      FCMPlugin.createNotificationChannelAndroid({        
        id: "urgent_alert", // required        
        name: "Urgent Alert", // required        
        description: "Very urgent message alert",        
        importance: "high",
        visibility: "public",
        sound: "alert_sound",
        lights: true,
        vibration: true,
      });
      timer(3000).subscribe(() => this.showSplash = false) // <-- hide animation after 3s
    });
  }


  initialieApp() {
    this.statusBar.overlaysWebView(true);
    if (this.platform.is('android')) {
      this.statusBar.backgroundColorByHexString("#33000000");
    }
  }

}

