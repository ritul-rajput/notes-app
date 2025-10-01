import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Slider,
  useColorScheme,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../theme';

type DrawingTool = 'pen' | 'pencil' | 'marker' | 'eraser' | 'highlighter' | 'fill' | 'shape';
type ShapeType = 'line' | 'circle' | 'rectangle' | 'arrow' | 'triangle';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  locked: boolean;
}

interface AdvancedDrawingCanvasProps {
  onSave?: (data: any) => void;
}

export const AdvancedDrawingCanvas: React.FC<AdvancedDrawingCanvasProps> = ({ onSave }) => {
  const [tool, setTool] = useState<DrawingTool>('pen');
  const [shapeType, setShapeType] = useState<ShapeType>('line');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Background', visible: true, opacity: 1, locked: false },
    { id: '2', name: 'Layer 1', visible: true, opacity: 1, locked: false },
  ]);
  const [selectedLayer, setSelectedLayer] = useState('2');

  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const colorPalette = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Red', value: '#FF3B30' },
    { name: 'Orange', value: '#FF9500' },
    { name: 'Yellow', value: '#FFCC00' },
    { name: 'Green', value: '#34C759' },
    { name: 'Blue', value: '#007AFF' },
    { name: 'Purple', value: '#5856D6' },
    { name: 'Pink', value: '#FF2D55' },
    { name: 'Brown', value: '#A2845E' },
    { name: 'Gray', value: '#8E8E93' },
    { name: 'Teal', value: '#5AC8FA' },
  ];

  const tools = [
    { id: 'pen', icon: '🖊️', name: 'Pen' },
    { id: 'pencil', icon: '✏️', name: 'Pencil' },
    { id: 'marker', icon: '🖍️', name: 'Marker' },
    { id: 'highlighter', icon: '💡', name: 'Highlighter' },
    { id: 'eraser', icon: '🧹', name: 'Eraser' },
    { id: 'fill', icon: '🎨', name: 'Fill' },
    { id: 'shape', icon: '⬜', name: 'Shape' },
  ];

  const shapes = [
    { id: 'line', icon: '/', name: 'Line' },
    { id: 'circle', icon: '⭕', name: 'Circle' },
    { id: 'rectangle', icon: '▭', name: 'Rectangle' },
    { id: 'arrow', icon: '→', name: 'Arrow' },
    { id: 'triangle', icon: '△', name: 'Triangle' },
  ];

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length}`,
      visible: true,
      opacity: 1,
      locked: false,
    };
    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const toggleLayerVisibility = (id: string) => {
    setLayers(layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  };

  const deleteLayer = (id: string) => {
    if (layers.length > 1) {
      setLayers(layers.filter(l => l.id !== id));
      if (selectedLayer === id) {
        setSelectedLayer(layers[0].id);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Canvas Area */}
      <View style={styles.canvasContainer}>
        <View style={[styles.canvas, { backgroundColor: '#FFFFFF' }]}>
          <Text style={styles.canvasPlaceholder}>🎨</Text>
          <Text style={styles.canvasText}>Advanced Drawing Canvas</Text>
          <Text style={[styles.canvasSubtext, { color: theme.textSecondary }]}>
            React Native Skia Integration
          </Text>
          <Text style={[styles.canvasInfo, { color: theme.textSecondary }]}>
            Layer: {layers.find(l => l.id === selectedLayer)?.name}
          </Text>
        </View>
      </View>

      {/* Advanced Toolbar */}
      <View style={[styles.toolbar, { backgroundColor: theme.surface }]}>
        {/* Tool Selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.toolScroll}
        >
          <View style={styles.toolSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Tools</Text>
            <View style={styles.toolRow}>
              {tools.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.toolBtn,
                    tool === t.id && { backgroundColor: theme.primary, transform: [{ scale: 1.1 }] },
                  ]}
                  onPress={() => setTool(t.id as DrawingTool)}
                >
                  <Text style={styles.toolBtnIcon}>{t.icon}</Text>
                  {tool === t.id && (
                    <Text style={[styles.toolBtnLabel, { color: '#FFF' }]}>{t.name}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Shape Selection (if shape tool selected) */}
          {tool === 'shape' && (
            <View style={styles.toolSection}>
              <Text style={[styles.sectionLabel, { color: theme.text }]}>Shapes</Text>
              <View style={styles.toolRow}>
                {shapes.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    style={[
                      styles.shapBtn,
                      shapeType === s.id && { backgroundColor: theme.primary },
                    ]}
                    onPress={() => setShapeType(s.id as ShapeType)}
                  >
                    <Text style={styles.shapBtnIcon}>{s.icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Color Palette */}
          <View style={styles.toolSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>Colors</Text>
            <View style={styles.colorGrid}>
              {colorPalette.map((c) => (
                <TouchableOpacity
                  key={c.value}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: c.value },
                    color === c.value && styles.colorBtnSelected,
                    c.value === '#FFFFFF' && { borderWidth: 1, borderColor: '#E5E5EA' },
                  ]}
                  onPress={() => setColor(c.value)}
                />
              ))}
            </View>
          </View>

          {/* Stroke Settings */}
          <View style={styles.toolSection}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              Stroke Width: {strokeWidth.toFixed(1)}px
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={20}
              value={strokeWidth}
              onValueChange={setStrokeWidth}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor="#E5E5EA"
            />
            
            <Text style={[styles.sectionLabel, { color: theme.text, marginTop: spacing.sm }]}>
              Opacity: {(opacity * 100).toFixed(0)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={1}
              value={opacity}
              onValueChange={setOpacity}
              minimumTrackTintColor={theme.primary}
              maximumTrackTintColor="#E5E5EA"
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface }]}
            onPress={() => setShowAdvanced(!showAdvanced)}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>Layers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface }]}
          >
            <Text style={styles.actionIcon}>↶</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>Undo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.surface }]}
          >
            <Text style={styles.actionIcon}>↷</Text>
            <Text style={[styles.actionText, { color: theme.text }]}>Redo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: theme.error }]}
          >
            <Text style={[styles.actionIcon, { color: '#FFF' }]}>🗑️</Text>
            <Text style={[styles.actionText, { color: '#FFF' }]}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Layers Panel */}
        {showAdvanced && (
          <View style={[styles.layersPanel, { backgroundColor: theme.background }]}>
            <View style={styles.layersPanelHeader}>
              <Text style={[styles.layersPanelTitle, { color: theme.text }]}>Layers</Text>
              <TouchableOpacity onPress={addLayer}>
                <Text style={[styles.addLayerBtn, { color: theme.primary }]}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.layersList}>
              {[...layers].reverse().map((layer) => (
                <TouchableOpacity
                  key={layer.id}
                  style={[
                    styles.layerItem,
                    selectedLayer === layer.id && { backgroundColor: theme.primary + '20' },
                  ]}
                  onPress={() => setSelectedLayer(layer.id)}
                >
                  <TouchableOpacity onPress={() => toggleLayerVisibility(layer.id)}>
                    <Text style={styles.layerIcon}>
                      {layer.visible ? '👁️' : '🚫'}
                    </Text>
                  </TouchableOpacity>
                  
                  <Text style={[styles.layerName, { color: theme.text }]}>
                    {layer.name}
                  </Text>
                  
                  {layer.locked && <Text style={styles.layerIcon}>🔒</Text>}
                  
                  {layers.length > 1 && (
                    <TouchableOpacity onPress={() => deleteLayer(layer.id)}>
                      <Text style={styles.layerIcon}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasContainer: {
    flex: 1,
    padding: spacing.md,
  },
  canvas: {
    flex: 1,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  canvasPlaceholder: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  canvasText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  canvasSubtext: {
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
  },
  canvasInfo: {
    fontSize: typography.fontSize.xs,
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingVertical: spacing.md,
  },
  toolScroll: {
    maxHeight: 200,
  },
  toolSection: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    marginBottom: spacing.xs,
  },
  toolRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toolBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    backgroundColor: '#F2F2F7',
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolBtnIcon: {
    fontSize: 24,
  },
  toolBtnLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  shapBtn: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
    backgroundColor: '#F2F2F7',
  },
  shapBtnIcon: {
    fontSize: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  colorBtnSelected: {
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  slider: {
    width: 200,
    height: 40,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  actionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  layersPanel: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    maxHeight: 200,
  },
  layersPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  layersPanelTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  addLayerBtn: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
  },
  layersList: {
    flex: 1,
  },
  layerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  layerIcon: {
    fontSize: 18,
    marginRight: spacing.sm,
  },
  layerName: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});
