import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { StepperProps, StepperItemProps } from './Stepper.types';

const ACTIVE_COLOR = '#2563eb';
const INACTIVE_COLOR = '#d1d5db';
const TEXT_COLOR = '#111827';
const MUTED_COLOR = '#6b7280';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** Marker component — Stepper reads its props to define each step */
export const StepperItem = (_props: StepperItemProps) => null;

export const Stepper = ({
  children,
  activeStep = 0,
  orientation = 'horizontal',
  percentage = 0,
  progressColor,
  ghost = false,
  showCheckMark = true,
  showProgress = false,
}: StepperProps) => {
  // Extract step data from children
  const steps: StepperItemProps[] = React.Children.toArray(children)
    .filter(React.isValidElement)
    .map((child) => (child as React.ReactElement<StepperItemProps>).props);

  const isVertical = orientation === 'vertical';
  const safeActive = clamp(activeStep, 0, steps.length - 1);
  const safePercent = clamp(percentage, 0, 100);
  const fillColor = ghost ? INACTIVE_COLOR : (progressColor ?? ACTIVE_COLOR);

  // ─── Horizontal ───────────────────────────────────────────────────────────
  if (!isVertical) {
    return (
      <View style={styles.container}>
        <View style={styles.horizontalWrapper}>
          {steps.map((step, index) => {
            const isCompleted = index < safeActive;
            const isActive = index === safeActive;
            const isFirst = index === 0;
            const isLast = index === steps.length - 1;

            const leftActive = !isFirst && !ghost && index <= safeActive;
            const rightCompleted = !isLast && !ghost && index < safeActive;
            const rightProgress = !isLast && !ghost && isActive && showProgress;
            const rightRatio = rightProgress ? safePercent / 100 : rightCompleted ? 1 : 0;

            const circleStyle = [
              styles.circle,
              isCompleted && !ghost ? styles.circleCompleted : null,
              isActive && !ghost ? styles.circleActive : null,
              ghost ? styles.circleGhost : null,
            ];

            const circleTextStyle = [
              styles.circleText,
              !ghost && isActive ? styles.circleTextActive : null,
              !ghost && isCompleted ? styles.circleTextCompleted : null,
              ghost ? styles.textGhost : null,
            ];

            const labelStyle = [
              styles.label,
              !ghost && isActive ? styles.labelBold : null,
              !ghost && isCompleted ? styles.labelCompleted : null,
              !ghost && !isActive && !isCompleted ? styles.labelInactive : null,
              ghost ? styles.textGhost : null,
            ];

            return (
              <View key={index} style={styles.hStepItem}>
                {/* ── Node row: left-line | circle | right-line ── */}
                <View style={styles.hNodeRow}>
                  {/* Left half-connector */}
                  {isFirst ? (
                    <View style={styles.halfLine} />
                  ) : (
                    <View
                      style={[
                        styles.halfLine,
                        { backgroundColor: leftActive ? fillColor : INACTIVE_COLOR },
                        ghost ? styles.lineGhost : null,
                      ]}
                    />
                  )}

                  {/* Circle */}
                  <View style={circleStyle}>
                    <Text style={circleTextStyle}>
                      {isCompleted && showCheckMark ? '✓' : String(index + 1)}
                    </Text>
                  </View>

                  {/* Right half-connector */}
                  {isLast ? (
                    <View style={styles.halfLine} />
                  ) : rightRatio > 0 && rightRatio < 1 ? (
                    <View style={[styles.halfLine, styles.halfLineRow]}>
                      <View style={{ flex: rightRatio, backgroundColor: fillColor, height: 2 }} />
                      <View style={{ flex: 1 - rightRatio, backgroundColor: INACTIVE_COLOR, height: 2 }} />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.halfLine,
                        { backgroundColor: rightRatio === 1 ? fillColor : INACTIVE_COLOR },
                        ghost ? styles.lineGhost : null,
                      ]}
                    />
                  )}
                </View>

                {/* Label */}
                <Text style={labelStyle} numberOfLines={2}>
                  {step.label}
                </Text>

                {/* Description */}
                {step.description ? (
                  <Text style={[styles.description, ghost ? styles.textGhost : null]} numberOfLines={3}>
                    {step.description}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  // ─── Vertical ─────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const isCompleted = index < safeActive;
        const isActive = index === safeActive;
        const isLast = index === steps.length - 1;

        const lineCompleted = !isLast && !ghost && index < safeActive;
        const lineProgress = !isLast && !ghost && isActive && showProgress;
        const lineRatio = lineProgress ? safePercent / 100 : lineCompleted ? 1 : 0;

        const circleStyle = [
          styles.circle,
          isCompleted && !ghost ? styles.circleCompleted : null,
          isActive && !ghost ? styles.circleActive : null,
          ghost ? styles.circleGhost : null,
        ];

        const circleTextStyle = [
          styles.circleText,
          !ghost && isActive ? styles.circleTextActive : null,
          !ghost && isCompleted ? styles.circleTextCompleted : null,
          ghost ? styles.textGhost : null,
        ];

        const labelStyle = [
          styles.label,
          !ghost && isActive ? styles.labelBold : null,
          !ghost && isCompleted ? styles.labelCompleted : null,
          !ghost && !isActive && !isCompleted ? styles.labelInactive : null,
          ghost ? styles.textGhost : null,
        ];

        return (
          <View key={index} style={styles.vStepItem}>
            {/* Left column: circle + vertical line */}
            <View style={styles.vNodeColumn}>
              <View style={circleStyle}>
                <Text style={circleTextStyle}>
                  {isCompleted && showCheckMark ? '✓' : String(index + 1)}
                </Text>
              </View>

              {!isLast && (
                <View style={[styles.vLineContainer, ghost ? styles.lineGhost : null]}>
                  {lineRatio > 0 && lineRatio < 1 ? (
                    <>
                      <View style={{ flex: lineRatio, backgroundColor: fillColor, width: 2 }} />
                      <View style={{ flex: 1 - lineRatio, width: 2 }} />
                    </>
                  ) : (
                    <View
                      style={[
                        styles.vLineFill,
                        { backgroundColor: lineRatio === 1 ? fillColor : 'transparent' },
                      ]}
                    />
                  )}
                </View>
              )}
            </View>

            {/* Right column: label + description */}
            <View style={styles.vTextContainer}>
              <Text style={labelStyle}>{step.label}</Text>
              {step.description ? (
                <Text style={[styles.description, ghost ? styles.textGhost : null]}>
                  {step.description}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  // ── Horizontal ──────────────────────────────────────────
  horizontalWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hStepItem: {
    flex: 1,
    alignItems: 'center',
  },
  hNodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  halfLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'transparent',
  },
  halfLineRow: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },

  // ── Vertical ────────────────────────────────────────────
  vStepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  vNodeColumn: {
    alignItems: 'center',
    width: 36,
  },
  vLineContainer: {
    flex: 1,
    width: 2,
    minHeight: 40,
    backgroundColor: INACTIVE_COLOR,
    flexDirection: 'column',
    marginVertical: 4,
  },
  vLineFill: {
    flex: 1,
    width: 2,
  },
  vTextContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 24,
    paddingTop: 6,
  },

  // ── Circle ──────────────────────────────────────────────
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: INACTIVE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    borderColor: ACTIVE_COLOR,
  },
  circleCompleted: {
    borderColor: ACTIVE_COLOR,
    backgroundColor: ACTIVE_COLOR,
  },
  circleGhost: {
    borderColor: '#e5e7eb',
    backgroundColor: 'transparent',
  },
  circleText: {
    color: MUTED_COLOR,
    fontWeight: '700',
    fontSize: 14,
  },
  circleTextActive: {
    color: ACTIVE_COLOR,
  },
  circleTextCompleted: {
    color: '#ffffff',
  },

  // ── Lines ───────────────────────────────────────────────
  lineGhost: {
    backgroundColor: '#e5e7eb',
  },

  // ── Text ────────────────────────────────────────────────
  label: {
    color: MUTED_COLOR,
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  labelBold: {
    color: TEXT_COLOR,
    fontWeight: '700',
  },
  labelCompleted: {
    color: ACTIVE_COLOR,
    fontWeight: '700',
  },
  labelInactive: {
    color: MUTED_COLOR,
    fontWeight: '400',
  },
  description: {
    color: MUTED_COLOR,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  textGhost: {
    color: '#ffffff',
  },
});
