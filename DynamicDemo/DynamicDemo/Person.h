//
//  Person.h
//  DynamicDemo
//
//  Created by 夏敏 on 2020/5/28.
//  Copyright © 2020 rober. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface Person : NSObject

@property (nonatomic, strong) NSString *name;

- (void)walk;
+ (void)walk;

@end

NS_ASSUME_NONNULL_END
