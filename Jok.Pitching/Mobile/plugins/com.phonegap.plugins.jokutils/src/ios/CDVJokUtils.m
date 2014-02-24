//
//  Echo.m
//  Jok Pool
//
//  Created by Ezeki Zibzibadze on 9/21/13.
//
//

#import "CDVJokUtils.h"
#import "MediaPlayer/MediaPlayer.h"

@implementation CDVJokUtils

- (void)playAudio:(CDVInvokedUrlCommand*)command
{
    @try {
        
        NSBundle * mainBundle = [NSBundle mainBundle];
        NSMutableArray *directoryParts = [NSMutableArray arrayWithArray:[(NSString*)[command.arguments objectAtIndex:0] componentsSeparatedByString:@"/"]];
        NSString       *filename       = [directoryParts lastObject];
        [directoryParts removeLastObject];

        NSMutableArray *filenameParts  = [NSMutableArray arrayWithArray:[filename componentsSeparatedByString:@"."]];
        [directoryParts insertObject:@"www" atIndex:0];
        NSString *directoryStr = [directoryParts componentsJoinedByString:@"/"];

        NSString *filePath = [mainBundle pathForResource:(NSString*)[filenameParts objectAtIndex:0]
                                                      ofType:(NSString*)[filenameParts objectAtIndex:1]
                                                 inDirectory:directoryStr];

        SystemSoundID soundID;
        NSURL *fileURL = [NSURL fileURLWithPath:filePath];

        AudioServicesCreateSystemSoundID((__bridge CFURLRef)fileURL, &soundID);
        AudioServicesPlaySystemSound(soundID);
        
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            
    }
    @catch (NSException *exception) {
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }
}

-(void)setPlayingAudioTitle:(CDVInvokedUrlCommand*)command
{
    NSMutableDictionary *nowPlayingInfo = [[NSMutableDictionary alloc] init];
    [nowPlayingInfo setObject:[command.arguments objectAtIndex:0] forKey:MPMediaItemPropertyArtist];
    [nowPlayingInfo setObject:[command.arguments objectAtIndex:1] forKey:MPMediaItemPropertyTitle];
    
    [nowPlayingInfo setObject:[NSNumber numberWithDouble:0] forKey:MPNowPlayingInfoPropertyPlaybackRate];
    [nowPlayingInfo setObject:[NSNumber numberWithDouble:0] forKey:MPNowPlayingInfoPropertyElapsedPlaybackTime];
    [MPNowPlayingInfoCenter defaultCenter].nowPlayingInfo = nowPlayingInfo;
}

@end
