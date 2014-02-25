//
//  Echo.h
//  Jok Pool
//
//  Created by Ezeki Zibzibadze on 9/21/13.
//
//

#import <Cordova/CDVPlugin.h>
#import <AudioToolbox/AudioServices.h>
#import <AVFoundation/AVPlayer.h>

@interface CDVJokUtils : CDVPlugin

@property (nonatomic, strong) IBOutlet AVPlayer* player;

    
- (void)playAudio:(CDVInvokedUrlCommand*)command;

- (void)playAudioStream:(CDVInvokedUrlCommand*)command;

- (void)stopAudioStream:(CDVInvokedUrlCommand*)command;

- (void)setPlayingAudioTitle:(CDVInvokedUrlCommand*)command;
    
@end
