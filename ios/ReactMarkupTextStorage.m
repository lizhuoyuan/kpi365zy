//
//  ReactMarkupTextStorage.m
//  kpi365
//
//  Created by AOLC on 2017/3/6.
//  Copyright © 2017年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ReactMarkupTextStorage.h"
@implementation ReactMarkupTextStorage
{
  NSMutableAttributedString * _backingStore;
}

- (id)init
{
  self = [ super init ];
  if( self ){
    _backingStore = [ [NSMutableAttributedString alloc] init ];
  }
  return self;
}
- (NSString *)string
{
  return [_backingStore string];
}

- (NSDictionary *)attributesAtIndex:(NSUInteger)location effectiveRange:(NSRangePointer)range
{
  return [_backingStore attributesAtIndex:location effectiveRange:range];
}

- (void)replaceCharactersInRange:(NSRange)range withString:(NSString *)str
{
  [self beginEditing];
  [_backingStore replaceCharactersInRange:range withString:str];
  [self edited:NSTextStorageEditedCharacters | NSTextStorageEditedAttributes
         range:range changeInLength:str.length - range.length];
  [self endEditing];
}

- (void)setAttributes:(NSDictionary *)attrs range:(NSRange)range
{
  [self beginEditing];
  [_backingStore setAttributes:attrs range:range];
  [self edited:NSTextStorageEditedAttributes
         range:range changeInLength:0];
  [self endEditing];
}
- (void)createMarkupTextView
{
  NSDictionary *attributes = @{NSFontAttributeName: [UIFont preferredFontForTextStyle:UIFontTextStyleBody]};
  NSString *content = [NSString stringWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"content" ofType:@"txt"]
                                                encoding:NSUTF8StringEncoding
                                                   error:nil];
  NSAttributedString *attributedString = [[NSAttributedString alloc] initWithString:content
                                                                         attributes:attributes];
  _textStorage = [[ReactMarkupTextStorage alloc] init];
  [_textStorage setAttributedString:attributedString];
  
  CGRect textViewRect = CGRectMake(20, 60, 280, self.view.bounds.size.height - 100);
  
  NSLayoutManager *layoutManager = [[NSLayoutManager alloc] init];
  
  NSTextContainer *textContainer = [[NSTextContainer alloc] initWithSize:CGSizeMake(textViewRect.size.width, CGFLOAT_MAX)];
  [layoutManager addTextContainer:textContainer];
  [_textStorage addLayoutManager:layoutManager];
  
  _textView = [[UITextView alloc] initWithFrame:textViewRect
                                  textContainer:textContainer];
  _textView.delegate = self;
  [self.view addSubview:_textView];
}
- (void)processEditing
{
  [self performReplacementsForRange:[self editedRange]];
  [super processEditing];
}
- (void)performReplacementsForRange:(NSRange)changedRange
{
  NSRange extendedRange = NSUnionRange(changedRange, [[_backingStore string]
                                                      lineRangeForRange:NSMakeRange(changedRange.location, 0)]);
  extendedRange = NSUnionRange(changedRange, [[_backingStore string]
                                              lineRangeForRange:NSMakeRange(NSMaxRange(changedRange), 0)]);
  [self applyStylesToRange:extendedRange];
}
- (NSDictionary*)createAttributesForFontStyle:(NSString*)style
                                    withTrait:(uint32_t)trait {
  UIFontDescriptor *fontDescriptor = [UIFontDescriptor
                                      preferredFontDescriptorWithTextStyle:UIFontTextStyleBody];
  
  UIFontDescriptor *descriptorWithTrait = [fontDescriptor
                                           fontDescriptorWithSymbolicTraits:trait];
  
  UIFont* font =  [UIFont fontWithDescriptor:descriptorWithTrait size: 0.0];
  return @{ NSFontAttributeName : font };
}

- (void)createMarkupStyledPatterns
{
  UIFontDescriptor *scriptFontDescriptor =
  [UIFontDescriptor fontDescriptorWithFontAttributes:
   @{UIFontDescriptorFamilyAttribute: @"Bradley Hand"}];
  
  // 1. base our script font on the preferred body font size
  UIFontDescriptor* bodyFontDescriptor = [UIFontDescriptor
                                          preferredFontDescriptorWithTextStyle:UIFontTextStyleBody];
  NSNumber* bodyFontSize = bodyFontDescriptor.
  fontAttributes[UIFontDescriptorSizeAttribute];
  UIFont* scriptFont = [UIFont
                        fontWithDescriptor:scriptFontDescriptor size:[bodyFontSize floatValue]];
  
  // 2. create the attributes
  NSDictionary* boldAttributes = [self
                                  createAttributesForFontStyle:UIFontTextStyleBody
                                  withTrait:UIFontDescriptorTraitBold];
  NSDictionary* italicAttributes = [self
                                    createAttributesForFontStyle:UIFontTextStyleBody
                                    withTrait:UIFontDescriptorTraitItalic];
  NSDictionary* strikeThroughAttributes = @{ NSStrikethroughStyleAttributeName : @1,
                                             NSForegroundColorAttributeName: [UIColor redColor]};
  NSDictionary* scriptAttributes = @{ NSFontAttributeName : scriptFont,
                                      NSForegroundColorAttributeName: [UIColor blueColor]
                                      };
  NSDictionary* redTextAttributes =
  @{ NSForegroundColorAttributeName : [UIColor redColor]};
  
  _replacements = @{
                    @"(\\*\\*\\w+(\\s\\w+)*\\*\\*)" : boldAttributes,
                    @"(_\\w+(\\s\\w+)*_)" : italicAttributes,
                    @"(~~\\w+(\\s\\w+)*~~)" : strikeThroughAttributes,
                    @"(`\\w+(\\s\\w+)*`)" : scriptAttributes,
                    @"\\s([A-Z]{2,})\\s" : redTextAttributes
                    };
}
- (void)applyStylesToRange:(NSRange)searchRange
{
  NSDictionary* normalAttrs = @{NSFontAttributeName:
                                  [UIFont preferredFontForTextStyle:UIFontTextStyleBody]};
  
  // iterate over each replacement
  for (NSString* key in _replacements) {
    NSRegularExpression *regex = [NSRegularExpression
                                  regularExpressionWithPattern:key
                                  options:0
                                  error:nil];
    
    NSDictionary* attributes = _replacements[key];
    
    [regex enumerateMatchesInString:[_backingStore string]
                            options:0
                              range:searchRange
                         usingBlock:^(NSTextCheckingResult *match,
                                      NSMatchingFlags flags,
                                      BOOL *stop){
                           // apply the style
                           NSRange matchRange = [match rangeAtIndex:1];
                           [self addAttributes:attributes range:matchRange];
                           
                           // reset the style to the original
                           if (NSMaxRange(matchRange)+1 < self.length) {
                             [self addAttributes:normalAttrs
                                           range:NSMakeRange(NSMaxRange(matchRange)+1, 1)];
                           }
                         }];
  }
}
@end
