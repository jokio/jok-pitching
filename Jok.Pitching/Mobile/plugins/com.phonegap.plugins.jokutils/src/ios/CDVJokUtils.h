//
//  Echo.h
//  Jok Pool
//
//  Created by Ezeki Zibzibadze on 9/21/13.
//
//

#import <Cordova/CDVPlugin.h>
#import <AudioToolbox/AudioServices.h>

@interface CDVJokUtils : CDVPlugin
    
- (void)playAudio:(CDVInvokedUrlCommand*)command;

- (void)setPlayingAudioTitle:(CDVInvokedUrlCommand*)command;
    
@end
