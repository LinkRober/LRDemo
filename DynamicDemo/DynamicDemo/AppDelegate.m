//
//  AppDelegate.m
//  DynamicDemo
//
//  Created by 夏敏 on 2020/5/22.
//  Copyright © 2020 rober. All rights reserved.
//

#import "AppDelegate.h"
#import <JavaScriptCore/JavaScriptCore.h>
#import <objc/runtime.h>

static char *kPropAssociatedObjectKey;

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
    JSContext *context = [[JSContext alloc] init];
    context[@"hello"] = ^(NSString *msg) {
        NSLog(@"hello %@",msg);
    };
    [context evaluateScript:@"hello('world')"];
    NSString *path = [[NSBundle bundleForClass:[self class]] pathForResource:@"dynamic_demo" ofType:@"js"];
    NSString *jsCore = [[NSString alloc] initWithData:[[NSFileManager defaultManager] contentsAtPath:path] encoding:NSUTF8StringEncoding];
//    [content evaluateScript:@"UIView.__c('alloc')().__c('init')()"];
    context[@"_OC_callC"] = ^id(NSString *className, NSString *selectorName, JSValue *arguments) {
        id obj = [arguments toObject];
//        if([obj isKindOfClass:[NSArray class]]) {
//            NSLog(@"");
//        }
        return @"hello";
    };
    context[@"_OC_getCustomProps"] = ^id(JSValue *obj) {
//        id realObj = formatJSToOC(obj);
        id realObj = [obj toObject];
        return objc_getAssociatedObject(realObj, kPropAssociatedObjectKey);
    };
    
    context[@"_OC_setCustomProps"] = ^(JSValue *obj, JSValue *val) {
//        id realObj = formatJSToOC(obj);
        id realObj = [obj toObject];
        objc_setAssociatedObject(realObj, kPropAssociatedObjectKey, val, OBJC_ASSOCIATION_RETAIN_NONATOMIC);
    };
    
    [context evaluateScript:jsCore];
    return YES;
}


#pragma mark - UISceneSession lifecycle


- (UISceneConfiguration *)application:(UIApplication *)application configurationForConnectingSceneSession:(UISceneSession *)connectingSceneSession options:(UISceneConnectionOptions *)options {
    // Called when a new scene session is being created.
    // Use this method to select a configuration to create the new scene with.
    return [[UISceneConfiguration alloc] initWithName:@"Default Configuration" sessionRole:connectingSceneSession.role];
}


- (void)application:(UIApplication *)application didDiscardSceneSessions:(NSSet<UISceneSession *> *)sceneSessions {
    // Called when the user discards a scene session.
    // If any sessions were discarded while the application was not running, this will be called shortly after application:didFinishLaunchingWithOptions.
    // Use this method to release any resources that were specific to the discarded scenes, as they will not return.
}


@end
