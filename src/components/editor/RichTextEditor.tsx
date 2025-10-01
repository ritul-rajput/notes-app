import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

type TextStyle = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikethrough: boolean;
  heading: number; // 0 = normal, 1-3 = h1-h3
  alignment: 'left' | 'center' | 'right';
  listType: 'none' | 'bullet' | 'number';
};

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
}) => {
  const [textStyle, setTextStyle] = useState<TextStyle>({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    heading: 0,
    alignment: 'left',
    listType: 'none',
  });

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];
  const textInputRef = useRef<TextInput>(null);

  const toggleStyle = (style: keyof TextStyle) => {
    setTextStyle((prev) => ({
      ...prev,
      [style]: !prev[style as keyof TextStyle],
    }));
  };

  const setHeading = (level: number) => {
    setTextStyle((prev) => ({ ...prev, heading: level }));
  };

  const setAlignment = (align: 'left' | 'center' | 'right') => {
    setTextStyle((prev) => ({ ...prev, alignment: align }));
  };

  const setListType = (type: 'none' | 'bullet' | 'number') => {
    setTextStyle((prev) => ({ ...prev, listType: type }));
  };

  const insertMarkdown = (markdown: string) => {
    const newContent = content + markdown;
    onChange(newContent);
  };

  return (
    <View style={styles.container}>
      {/* Formatting Toolbar */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.toolbar, { backgroundColor: theme.surface }]}
        contentContainerStyle={styles.toolbarContent}
      >
        {/* Text Styles */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.bold && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => toggleStyle('bold')}
          >
            <Text style={[styles.toolIcon, { fontWeight: '700' }]}>B</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.italic && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => toggleStyle('italic')}
          >
            <Text style={[styles.toolIcon, { fontStyle: 'italic' }]}>I</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.underline && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => toggleStyle('underline')}
          >
            <Text style={[styles.toolIcon, { textDecorationLine: 'underline' }]}>U</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.strikethrough && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => toggleStyle('strikethrough')}
          >
            <Text style={[styles.toolIcon, { textDecorationLine: 'line-through' }]}>S</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Headings */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.heading === 1 && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setHeading(1)}
          >
            <Text style={styles.toolText}>H1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.heading === 2 && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setHeading(2)}
          >
            <Text style={styles.toolText}>H2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.heading === 3 && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setHeading(3)}
          >
            <Text style={styles.toolText}>H3</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Alignment */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.alignment === 'left' && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setAlignment('left')}
          >
            <Text style={styles.toolIcon}>≡</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.alignment === 'center' && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setAlignment('center')}
          >
            <Text style={styles.toolIcon}>≣</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.alignment === 'right' && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setAlignment('right')}
          >
            <Text style={styles.toolIcon}>≡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Lists */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.listType === 'bullet' && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setListType('bullet')}
          >
            <Text style={styles.toolIcon}>•</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              textStyle.listType === 'number' && { backgroundColor: theme.primary + '20' },
            ]}
            onPress={() => setListType('number')}
          >
            <Text style={styles.toolIcon}>1.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Insert Options */}
        <View style={styles.toolGroup}>
          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => insertMarkdown('[Link](url)')}
          >
            <Text style={styles.toolIcon}>🔗</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => insertMarkdown('\n```\ncode\n```\n')}
          >
            <Text style={styles.toolIcon}>{'</>'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => insertMarkdown('\n> Quote\n')}
          >
            <Text style={styles.toolIcon}>"</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toolButton}
            onPress={() => insertMarkdown('---\n')}
          >
            <Text style={styles.toolIcon}>─</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Special */}
        <View style={styles.toolGroup}>
          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>📷</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>📎</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>🏷️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolButton}>
            <Text style={styles.toolIcon}>☑️</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Text Input */}
      <TextInput
        ref={textInputRef}
        style={[
          styles.textInput,
          {
            color: theme.text,
            fontWeight: textStyle.bold ? '700' : '400',
            fontStyle: textStyle.italic ? 'italic' : 'normal',
            textDecorationLine: textStyle.underline
              ? 'underline'
              : textStyle.strikethrough
              ? 'line-through'
              : 'none',
            textAlign: textStyle.alignment,
            fontSize:
              textStyle.heading === 1
                ? 28
                : textStyle.heading === 2
                ? 24
                : textStyle.heading === 3
                ? 20
                : typography.fontSize.md,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={content}
        onChangeText={onChange}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    maxHeight: 56,
  },
  toolbarContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
  toolGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  toolIcon: {
    fontSize: 18,
    color: '#000',
  },
  toolText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5EA',
    marginHorizontal: spacing.sm,
  },
  textInput: {
    flex: 1,
    padding: spacing.lg,
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.lg,
  },
});
