import { StyleSheet } from 'react-native';

export const THUMB_SIZE = 22;
export const TRACK_HEIGHT = 4;

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: TRACK_HEIGHT,
    backgroundColor: '#e0e3e7',
    borderRadius: TRACK_HEIGHT / 2,
  },
  activeTrack: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: '#555ab9',
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#555ab9',
    top: '50%',
    marginTop: -(THUMB_SIZE / 2),
  },
  disabledThumb: {
    backgroundColor: '#ccc',
  },
});
