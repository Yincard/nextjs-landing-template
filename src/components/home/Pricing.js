'use client'

import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CogIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'MoreFeature_1',
    description: 'MoreFeature_1 description',
    icon: ChartBarIcon,
  },
  {
    name: 'MoreFeature_2',
    description: 'MoreFeature_2 description',
    icon: CogIcon,
  },
  {
    name: 'MoreFeature_3',
    description: 'MoreFeature_3 description',
    icon: LightBulbIcon,
  },
  {
    name: 'MoreFeature_4',
    description: 'MoreFeature_4 description',
    icon: ShieldCheckIcon,
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            More Scrolling Animations
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Useful for displaying a table of data
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-6 left-6">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}