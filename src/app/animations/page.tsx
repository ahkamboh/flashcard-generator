import React from 'react'
import SequentialText from '../components/SequentialText'
import AnimatedText from '../components/AnimatedText'

function page() {
  return (
    <div>
        <SequentialText text={['Aneeza', 'Shakeel', 'Syeda','Fatima', 'Ali', 'Hamza']} speed={.8}/>
        <div className="mt-8">
        <AnimatedText  text={['Aneeza', 'Shakeel', 'Syeda','Fatima', 'Ali', 'Hamza']} speed={.6} />
        </div>
    </div>
  )
}

export default page